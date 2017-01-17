import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {Observable} from 'rxjs/Observable';

import {
    MarginComponentsServerData,
    MarginComponentsAggregationData,
    MarginComponentsBaseData,
    MarginComponentsRowData, MarginComponentsTree, MarginComponentsTreeNode
} from './margin.types';

const marginComponentsAggregationURL: string = '/mc/latest';
const marginComponentsTreemapURL: string = '/mc/latest';
const marginComponentsLatestURL: string = '/mc/latest/:0/:1/:2/:3/:4';
const marginComponentsHistoryURL: string = '/mc/history/:0/:1/:2/:3/:4';

@Injectable()
export class MarginComponentsService {

    constructor(private http: HttpService<MarginComponentsServerData[]>) {
    }

    public getMarginComponentsAggregationData(): Observable<MarginComponentsAggregationData> {
        return this.http.get({resourceURL: marginComponentsAggregationURL}).map(
            (data: MarginComponentsServerData[]) => {
                if (!data) {
                    return {};
                }
                let newViewWindow: {[key: string]: MarginComponentsBaseData} = {};
                let footerData: MarginComponentsBaseData = {
                    uid: null,
                    variationMargin: 0,
                    liquiMargin: 0,
                    premiumMargin: 0,
                    spreadMargin: 0,
                    additionalMargin: 0
                };

                for (let index = 0; index < data.length; ++index) {
                    let record = data[index];
                    let fKey = record.clearer + '-' + record.member + '-' + record.account;

                    if (fKey in newViewWindow) {
                        let cellData: MarginComponentsBaseData = newViewWindow[fKey];
                        cellData.variationMargin += record.variationMargin;
                        cellData.liquiMargin += record.liquiMargin;
                        cellData.premiumMargin += record.premiumMargin;
                        cellData.spreadMargin += record.spreadMargin;
                        cellData.additionalMargin += record.additionalMargin;

                        footerData.variationMargin += record.variationMargin;
                        footerData.liquiMargin += record.liquiMargin;
                        footerData.premiumMargin += record.premiumMargin;
                        footerData.spreadMargin += record.spreadMargin;
                        footerData.additionalMargin += record.additionalMargin;
                    } else {
                        newViewWindow[fKey] = {
                            uid: this.computeUID(record),
                            clearer: record.clearer,
                            member: record.member,
                            account: record.account,
                            premiumMargin: record.premiumMargin,
                            additionalMargin: record.additionalMargin,
                            liquiMargin: record.liquiMargin,
                            spreadMargin: record.spreadMargin,
                            variationMargin: record.variationMargin
                        };

                        footerData.variationMargin += record.variationMargin;
                        footerData.liquiMargin += record.liquiMargin;
                        footerData.premiumMargin += record.premiumMargin;
                        footerData.spreadMargin += record.spreadMargin;
                        footerData.additionalMargin += record.additionalMargin;
                    }
                }

                return {
                    aggregatedRows: Object.keys(newViewWindow).map((key: string) => {
                        return newViewWindow[key];
                    }),
                    summary: footerData
                };
            });
    }

    public getMarginComponentsTreeMapData(): Observable<MarginComponentsTree> {
        return this.http.get({resourceURL: marginComponentsTreemapURL}).map(
            (data: MarginComponentsServerData[]) => {
                if (!data) {
                    return {};
                }
                let members: {[key: string]: boolean} = {};
                let accounts: {[key: string]: boolean} = {};
                let classes: {[key: string]: boolean} = {};
                let tree = new MarginComponentsTree({id: 'all', text: 'all', value: 0});

                for (let index = 0; index < data.length; ++index) {
                    if (data[index].additionalMargin === 0) continue;

                    let clearer = data[index].clearer;
                    let member = clearer + '-' + data[index].member;
                    let account = member + '-' + data[index].account;
                    let clss = account + '-' + data[index].clss;
                    let ccy = clss + '-' + data[index].ccy;

                    if (!members[member]) {
                        members[member] = true;
                        tree.add({
                            id: member,
                            text: member.replace(/\w+-/, ''),
                            value: 0,
                            clearer: clearer,
                            member: data[index].member
                        }, 'all');
                    }

                    if (!accounts[account]) {
                        accounts[account] = true;
                        tree.add({
                            id: account,
                            text: account.replace(/\w+-/, ''),
                            value: 0,
                            clearer: clearer,
                            member: data[index].member,
                            account: data[index].account
                        }, member);
                    }

                    if (!classes[clss]) {
                        classes[clss] = true;
                        tree.add({
                            id: clss,
                            text: clss.replace(/\w+-/, ''),
                            value: 0,
                            clearer: clearer,
                            member: data[index].member,
                            account: data[index].account,
                            clss: data[index].clss
                        }, account);
                    }

                    tree.add({
                        id: ccy,
                        text: ccy.replace(/\w+-/, ''),
                        value: data[index].additionalMargin,
                        leaf: true,
                        clearer: clearer,
                        member: data[index].member,
                        account: data[index].account,
                        clss: data[index].clss,
                        ccy: data[index].ccy
                    }, clss);
                }
                tree.traverseDF((node: MarginComponentsTreeNode) => {
                    node.children.sort(function (a, b) {
                        return b.data.value - a.data.value;
                    });
                });
                tree.traverseBF((node: MarginComponentsTreeNode) => {
                    let restNode = new MarginComponentsTreeNode({
                        id: node.data.id + '-Rest',
                        text: node.data.text + '-Rest',
                        value: 0,
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

    public getMarginComponentsLatest(clearer: string = '*', member: string = '*', account: string = '*',
                                     clss: string = '*', ccy: string = '*'): Observable<MarginComponentsRowData[]> {
        return this.http.get({
            resourceURL: marginComponentsLatestURL,
            params: [
                clearer,
                member,
                account,
                clss,
                ccy
            ]
        }).map((data: MarginComponentsServerData[]) => {
            let result: MarginComponentsRowData[] = [];
            if (data) {
                data.forEach((record: MarginComponentsServerData) => {
                    let row: MarginComponentsRowData = {
                        uid: this.computeUID(record),
                        clearer: record.clearer,
                        member: record.member,
                        account: record.account,
                        class: record.clss,
                        bizDt: record.bizDt,
                        premiumMargin: record.premiumMargin,
                        received: new Date(record.received),
                        ccy: record.ccy,
                        additionalMargin: record.additionalMargin,
                        liquiMargin: record.liquiMargin,
                        spreadMargin: record.spreadMargin,
                        variationMargin: record.variationMargin
                    };

                    row.variLiqui = record.variationMargin + record.liquiMargin;

                    result.push(row);
                });
                return result;
            } else {
                return [];
            }
        });
    }

    public getMarginComponentsHistory(clearer: string, member: string, account: string, clss: string, ccy: string): Observable<MarginComponentsRowData[]> {
        return this.http.get({
            resourceURL: marginComponentsHistoryURL,
            params: [
                clearer,
                member,
                account,
                clss,
                ccy
            ]
        }).map((data: MarginComponentsServerData[]) => {
            let result: MarginComponentsRowData[] = [];
            if (data) {
                data.forEach((record: MarginComponentsServerData) => {
                    let row: MarginComponentsRowData = {
                        uid: this.computeUID(record),
                        clearer: record.clearer,
                        member: record.member,
                        account: record.account,
                        class: record.clss,
                        bizDt: record.bizDt,
                        premiumMargin: record.premiumMargin,
                        received: new Date(record.received),
                        ccy: record.ccy,
                        additionalMargin: record.additionalMargin,
                        liquiMargin: record.liquiMargin,
                        spreadMargin: record.spreadMargin,
                        variationMargin: record.variationMargin
                    };

                    row.variLiqui = record.variationMargin + record.liquiMargin;

                    result.push(row);
                });
                return result;
            } else {
                return [];
            }
        });
    }

    private computeUID(data: MarginComponentsServerData): string {
        if (data._id) {
            return Object.keys(data._id).sort().map((key: string) => {
                let value: any = (<any>data._id)[key];
                if (!value) {
                    return '';
                }
                return value.toString().replace('\.', '');
            }).join('-');
        } else if (data.id && data.id.$oid) {
            return data.id.$oid;
        }
        return null;
    }
}