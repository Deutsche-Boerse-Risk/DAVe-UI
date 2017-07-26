import {catchOperator, map} from '@angular/cdk';
import {Injectable} from '@angular/core';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {DateUtils, RxChain, StrictRxChain, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';

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

import {AbstractService} from '../abstract.service';
import {PeriodicHttpService} from '../periodic.http.service';

import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subscription} from 'rxjs/Subscription';

export const liquiGroupMarginLatestURL: string = '/api/v1.0/lgm/latest';
export const liquiGroupMarginHistoryURL: string = '/api/v1.0/lgm/history';

@Injectable()
export class LiquiGroupMarginService extends AbstractService {

    private latestSubject: ReplaySubject<LiquiGroupMarginData[]> = new ReplaySubject(1);
    private aggregationSubject: ReplaySubject<LiquiGroupMarginAggregationData> = new ReplaySubject(1);
    private treeMapSubject: ReplaySubject<LiquiGroupMarginTree> = new ReplaySubject(1);
    private latestSubscription: Subscription;

    constructor(private http: PeriodicHttpService<LiquiGroupMarginServerData[]>,
        private errorCollector: ErrorCollectorService, authService: AuthService) {
        super();
        this.setup(authService);
    }

    public setupPeriodicTimer(): void {
        this.setupLatestLoader();
        this.setupAggregationLoader();
        this.setupTreemapLoader();
    }

    /**
     * @deprecated Use for tests only
     */
    public destroyPeriodicTimer(): void {
        if (this.latestSubscription) {
            this.latestSubscription.unsubscribe();
            this.latestSubscription = null;
        }
    }

    private setupLatestLoader(): void {
        this.latestSubscription = this.loadData(liquiGroupMarginLatestURL)
            .call(catchOperator, (err: any) => this.errorCollector.handleStreamError(err))
            .subscribe((data: LiquiGroupMarginData[]) => this.latestSubject.next(data));
    }

    private setupTreemapLoader(): void {
        RxChain.from(this.latestSubject)
            .call(map, (data: LiquiGroupMarginServerData[]) => {
                if (!data || !data.length) {
                    return {
                        traverseDF: () => {
                        }
                    } as any;
                }
                let members: { [key: string]: boolean } = {};
                let accounts: { [key: string]: boolean } = {};
                let classes: { [key: string]: boolean } = {};
                let tree: LiquiGroupMarginTree = new LiquiGroupMarginTree({
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
            })
            .call(catchOperator, (err: any) => this.errorCollector.handleStreamError(err))
            .subscribe((data: LiquiGroupMarginTree) => this.treeMapSubject.next(data));
    }

    private setupAggregationLoader(): void {
        RxChain.from(this.latestSubject)
            .call(map, (data: LiquiGroupMarginServerData[]) => {
                if (!data) {
                    return {} as LiquiGroupMarginAggregationData;
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
            })
            .call(catchOperator, (err: any) => this.errorCollector.handleStreamError(err))
            .subscribe(
                (data: LiquiGroupMarginAggregationData) => this.aggregationSubject.next(data));
    }

    public getLiquiGroupMarginTreeMapData(): Observable<LiquiGroupMarginTree> {
        return this.treeMapSubject;
    }

    public getLiquiGroupMarginAggregationData(): Observable<LiquiGroupMarginAggregationData> {
        return this.aggregationSubject;
    }

    public getLiquiGroupMarginLatest(params: LiquiGroupMarginParams): Observable<LiquiGroupMarginData[]> {
        return RxChain.from(this.latestSubject)
            .call(map, (data: LiquiGroupMarginData[]) => {
                return data.filter((row: LiquiGroupMarginData) => {
                    return Object.keys(params).every(
                        (key: keyof LiquiGroupMarginParams) => params[key] === '*' || params[key] == null || params[key] == row[key]);
                });
            })
            .call(catchOperator,
                (err: any) => this.errorCollector.handleStreamError(err) as Observable<LiquiGroupMarginData[]>)
            .result();
    }

    public getLiquiGroupMarginHistory(params: LiquiGroupMarginHistoryParams): Observable<LiquiGroupMarginData[]> {
        return this.loadData(liquiGroupMarginHistoryURL, params)
            .call(catchOperator,
                (err: any) => this.errorCollector.handleStreamError(err) as Observable<LiquiGroupMarginData[]>)
            .result();
    }

    private loadData(url: string, params?: LiquiGroupMarginParams): StrictRxChain<LiquiGroupMarginData[]> {
        return this.http.get({
            resourceURL: url,
            params     : params
        }).call(map, (data: LiquiGroupMarginServerData[]) => data || [])
            .call(map, (data: LiquiGroupMarginServerData[]) =>
                data.map(LiquiGroupMarginService.processLiquiGroupMarginData));
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