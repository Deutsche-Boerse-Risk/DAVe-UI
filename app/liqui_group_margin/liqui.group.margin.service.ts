import {Injectable} from '@angular/core';

import {DateUtils, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {Observable} from 'rxjs/Observable';

import {
    LiquiGroupMarginAggregationData,
    LiquiGroupMarginBaseData,
    LiquiGroupMarginData,
    LiquiGroupMarginHistoryParams,
    LiquiGroupMarginParams,
    LiquiGroupMarginServerData,
    LiquiGroupMarginTree,
    LiquiGroupMarginTreeNode
} from './liqui.group.margin.types';

export const liquiGroupMarginAggregationURL: string = '/lgm/latest';
export const liquiGroupMarginTreemapURL: string = '/lgm/latest';
export const liquiGroupMarginLatestURL: string = '/lgm/latest';
export const liquiGroupMarginHistoryURL: string = '/lgm/history';

@Injectable()
export class LiquiGroupMarginService {

    constructor(private http: HttpService<LiquiGroupMarginServerData[]>) {
    }

    public getLiquiGroupMarginTreeMapData(): Observable<LiquiGroupMarginTree> {
        return this.http.get({resourceURL: liquiGroupMarginTreemapURL}).map(
            (data: LiquiGroupMarginServerData[]) => {
                if (!data || !data.length) {
                    return {
                        traverseDF: () => {
                        }
                    };
                }
                let members: { [key: string]: boolean } = {};
                let accounts: { [key: string]: boolean } = {};
                let classes: { [key: string]: boolean } = {};
                let tree = new LiquiGroupMarginTree({
                    id   : 'all',
                    text : 'all',
                    value: 0
                });

                for (let index = 0; index < data.length; ++index) {
                    if (data[index].additionalMargin === 0) {
                        continue;
                    }

                    let clearer = data[index].clearer;
                    let member = clearer + '-' + data[index].member;
                    let account = member + '-' + data[index].account;
                    let marginClass = account + '-' + data[index].marginClass;
                    let marginCurrency = marginClass + '-' + data[index].marginCurrency;

                    if (!members[member]) {
                        members[member] = true;
                        tree.add({
                            id     : member,
                            text   : member.replace(/\w+-/, ''),
                            value  : 0,
                            clearer: clearer,
                            member : data[index].member
                        }, 'all');
                    }

                    if (!accounts[account]) {
                        accounts[account] = true;
                        tree.add({
                            id     : account,
                            text   : account.replace(/\w+-/, ''),
                            value  : 0,
                            clearer: clearer,
                            member : data[index].member,
                            account: data[index].account
                        }, member);
                    }

                    if (!classes[marginClass]) {
                        classes[marginClass] = true;
                        tree.add({
                            id         : marginClass,
                            text       : marginClass.replace(/\w+-/, ''),
                            value      : 0,
                            clearer    : clearer,
                            member     : data[index].member,
                            account    : data[index].account,
                            marginClass: data[index].marginClass
                        }, account);
                    }

                    tree.add({
                        id            : marginCurrency,
                        text          : marginCurrency.replace(/\w+-/, ''),
                        value         : data[index].additionalMargin,
                        leaf          : true,
                        clearer       : clearer,
                        member        : data[index].member,
                        account       : data[index].account,
                        marginClass   : data[index].marginClass,
                        marginCurrency: data[index].marginCurrency
                    }, marginClass);
                }
                tree.traverseDF((node: LiquiGroupMarginTreeNode) => {
                    node.children.sort((a, b) => {
                        return b.data.value - a.data.value;
                    });
                });
                tree.traverseBF((node: LiquiGroupMarginTreeNode) => {
                    let restText;
                    if (node.data.text === 'all') {
                        restText = 'Rest';
                    } else {
                        restText = node.data.text + '-Rest';
                    }
                    let restNode = new LiquiGroupMarginTreeNode({
                        id     : node.data.id + '-Rest',
                        text   : restText,
                        value  : 0,
                        clearer: node.data.clearer
                    });
                    restNode.parent = node;
                    let aggregateCount = Math.max(node.children.length - 10, 0);
                    for (let i = 0; i < aggregateCount; i++) {
                        let smallNode = node.children.pop();
                        restNode.data.value += smallNode.data.value;
                        restNode.children = restNode.children.concat(smallNode.children);
                        for (let j = 0; j < smallNode.children.length; j++) {
                            smallNode.children[j].parent = restNode;
                        }
                    }
                    if (aggregateCount > 0) {
                        node.children.push(restNode);
                    }
                });
                return tree;
            });
    }

    public getLiquiGroupMarginAggregationData(): Observable<LiquiGroupMarginAggregationData> {
        return this.http.get({resourceURL: liquiGroupMarginAggregationURL}).map(
            (data: LiquiGroupMarginServerData[]) => {
                if (!data) {
                    return {};
                }
                let newViewWindow: { [key: string]: LiquiGroupMarginData } = {};
                let footerData: LiquiGroupMarginBaseData = {
                    premiumMargin              : 0,
                    currentLiquidatingMargin   : 0,
                    additionalMargin           : 0,
                    unadjustedMarginRequirement: 0,
                    variationPremiumPayment    : 0
                };

                data.forEach((record: LiquiGroupMarginServerData) => {
                    let fKey = UIDUtils.computeUID(record.clearer, record.member, record.account,
                        record.marginCurrency);

                    footerData.premiumMargin += record.premiumMargin;
                    footerData.currentLiquidatingMargin += record.currentLiquidatingMargin;
                    footerData.additionalMargin += record.additionalMargin;
                    footerData.unadjustedMarginRequirement += record.unadjustedMarginRequirement;
                    footerData.variationPremiumPayment += record.variationPremiumPayment;

                    if (fKey in newViewWindow) {
                        let cellData: LiquiGroupMarginData = newViewWindow[fKey];
                        cellData.premiumMargin += record.premiumMargin;
                        cellData.currentLiquidatingMargin += record.currentLiquidatingMargin;
                        cellData.additionalMargin += record.additionalMargin;
                        cellData.unadjustedMarginRequirement += record.unadjustedMarginRequirement;
                        cellData.variationPremiumPayment += record.variationPremiumPayment;
                    } else {
                        newViewWindow[fKey] = {
                            uid     : fKey,
                            ...record,
                            received: DateUtils.utcTimestampToDate(record.timestamp)
                        };
                    }
                });

                return {
                    aggregatedRows: Object.keys(newViewWindow).map((key: string) => {
                        return newViewWindow[key];
                    }),
                    summary       : footerData
                };
            });
    }

    public getLiquiGroupMarginLatest(params: LiquiGroupMarginParams): Observable<LiquiGroupMarginData[]> {
        return this.loadData(liquiGroupMarginLatestURL, params);
    }

    public getLiquiGroupMarginHistory(params: LiquiGroupMarginHistoryParams): Observable<LiquiGroupMarginData[]> {
        return this.loadData(liquiGroupMarginHistoryURL, params);
    }

    private loadData(url: string, params: LiquiGroupMarginParams): Observable<LiquiGroupMarginData[]> {
        return this.http.get({
            resourceURL: url,
            params     : params
        }).map((data: LiquiGroupMarginServerData[]) => data || [])
            .map((data: LiquiGroupMarginServerData[]) => data.map(LiquiGroupMarginService.processLiquiGroupMarginData));
    }

    private static processLiquiGroupMarginData(record: LiquiGroupMarginServerData): LiquiGroupMarginData {
        return {
            uid     : UIDUtils.computeUID(record.clearer, record.member, record.account, record.marginClass,
                record.marginCurrency, record.snapshotID),
            ...record,
            received: DateUtils.utcTimestampToDate(record.timestamp)
        };
    }
}