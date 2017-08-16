import {map} from '@angular/cdk';
import {Inject, Injectable} from '@angular/core';

import {
    AUTH_PROVIDER,
    AuthProvider,
    DateUtils,
    ReplaySubjectExt,
    RxChain,
    StrictRxChain,
    UIDUtils
} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';

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

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Subscriber} from 'rxjs/Subscriber';
import {of as observableOf} from 'rxjs/observable/of';

export const liquiGroupMarginLatestURL: string = '/api/v1.0/lgm/latest';
export const liquiGroupMarginHistoryURL: string = '/api/v1.0/lgm/history';

@Injectable()
export class LiquiGroupMarginService extends AbstractService {

    private latestSubject: ReplaySubjectExt<LiquiGroupMarginData[]> = new ReplaySubjectExt(1);
    private aggregationSubject: ReplaySubjectExt<LiquiGroupMarginAggregationData> = new ReplaySubjectExt(1);
    private treeMapSubject: ReplaySubjectExt<LiquiGroupMarginTree> = new ReplaySubjectExt(1);
    private latestSubscription: Subscription;
    private treeMapSubscription: Subscription;
    private aggregationSubscription: Subscription;

    constructor(private http: PeriodicHttpService<LiquiGroupMarginServerData[]>,
        private errorCollector: ErrorCollectorService,
        @Inject(AUTH_PROVIDER) authProvider: AuthProvider) {
        super();
        this.setup(authProvider);
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
        if (this.treeMapSubscription) {
            this.treeMapSubscription.unsubscribe();
            this.treeMapSubscription = null;
        }
        if (this.aggregationSubscription) {
            this.aggregationSubscription.unsubscribe();
            this.aggregationSubscription = null;
        }
    }

    private setupLatestLoader(): void {
        this.latestSubscription = this.loadData(liquiGroupMarginLatestURL,
            () => {
                if (!this.latestSubject.hasData) {
                    this.latestSubject.next([]);
                }
            })
            .subscribe((data: LiquiGroupMarginData[]) => this.latestSubject.next(data));
    }

    private setupTreemapLoader(): void {
        this.treeMapSubscription = RxChain.from(this.latestSubject)
            .guardedDeferredMap(
                (data: LiquiGroupMarginServerData[], subscriber: Subscriber<LiquiGroupMarginTree>) => {
                    if (!data || !data.length) {
                        subscriber.next({
                            traverseDF: () => {
                            }
                        } as any);
                        subscriber.complete();
                        return;
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
                    subscriber.next(tree);
                    subscriber.complete();
                    return;
                },
                (err: any) => {
                    if (!this.treeMapSubject.hasData) {
                        this.treeMapSubject.next({
                            traverseDF: () => {
                            }
                        } as any);
                    }
                    return this.errorCollector.handleStreamError(err);
                })
            .subscribe((data: LiquiGroupMarginTree) => this.treeMapSubject.next(data));
    }

    private setupAggregationLoader(): void {
        this.aggregationSubscription = RxChain.from(this.latestSubject)
            .guardedDeferredMap(
                (data: LiquiGroupMarginServerData[], subscriber: Subscriber<LiquiGroupMarginAggregationData>) => {
                    if (!data) {
                        subscriber.next({} as LiquiGroupMarginAggregationData);
                        subscriber.complete();
                        return;
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

                    subscriber.next({
                        aggregatedRows: Object.keys(newViewWindow).map((key: string) => {
                            return newViewWindow[key];
                        }),
                        summary       : footerData
                    });
                    subscriber.complete();
                },
                (err: any) => {
                    if (!this.aggregationSubject.hasData) {
                        this.aggregationSubject.next({} as LiquiGroupMarginAggregationData);
                    }
                    return this.errorCollector.handleStreamError(err);
                })
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
            .guardedDeferredMap(
                (data: LiquiGroupMarginData[], subscriber: Subscriber<LiquiGroupMarginData[]>) => {
                    subscriber.next(data.filter((row: LiquiGroupMarginData) => {
                        return Object.keys(params).every(
                            (key: keyof LiquiGroupMarginParams) => params[key] === '*' || params[key] == null || params[key] == row[key]);
                    }));
                    subscriber.complete();
                },
                (err: any) => {
                    this.errorCollector.handleStreamError(err);
                    return observableOf([]);
                });
    }

    public getLiquiGroupMarginHistory(params: LiquiGroupMarginHistoryParams): Observable<LiquiGroupMarginData[]> {
        let first = true;
        return this.loadData(liquiGroupMarginHistoryURL, () => first ? [] : null, params).call(map,
            (data: LiquiGroupMarginData[]) => {
                first = false;
                return data;
            });
    }

    private loadData(url: string, errorHandler: () => any,
        params?: LiquiGroupMarginParams): StrictRxChain<LiquiGroupMarginData[]> {
        return this.http.get({
            resourceURL: url,
            params     : params
        }, errorHandler).call(map, (data: LiquiGroupMarginServerData[]) => data || [])
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