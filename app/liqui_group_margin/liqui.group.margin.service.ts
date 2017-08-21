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

    private latestSubject: ReplaySubjectExt<LiquiGroupMarginData[]> = new ReplaySubjectExt<LiquiGroupMarginData[]>(1);
    private aggregationSubject: ReplaySubjectExt<LiquiGroupMarginAggregationData> = new ReplaySubjectExt<LiquiGroupMarginAggregationData>(
        1);
    private treeMapSubject: ReplaySubjectExt<LiquiGroupMarginTree> = new ReplaySubjectExt<LiquiGroupMarginTree>(1);
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
                            traverseBF: () => {
                            }
                        } as any);
                        subscriber.complete();
                        return;
                    }
                    let members: { [key: string]: boolean } = {};
                    let accounts: { [key: string]: boolean } = {};
                    let classes: { [key: string]: boolean } = {};
                    let tree: LiquiGroupMarginTree = new LiquiGroupMarginTree({
                        id              : 'all',
                        text            : 'all',
                        additionalMargin: 0
                    });

                    data.forEach((row: LiquiGroupMarginData) => {
                        if (row.additionalMargin === 0) {
                            return;
                        }

                        let clearer = row.clearer;
                        let member = clearer + '-' + row.member;
                        let account = member + '-' + row.account;
                        let marginClass = account + '-' + row.marginClass;
                        let marginCurrency = marginClass + '-' + row.marginCurrency;

                        if (!members[member]) {
                            members[member] = true;
                            tree.add({
                                id              : member,
                                text            : member.replace(/\w+-/, ''),
                                additionalMargin: 0,
                                clearer         : clearer,
                                member          : row.member
                            }, 'all');
                        }

                        if (!accounts[account]) {
                            accounts[account] = true;
                            tree.add({
                                id              : account,
                                text            : account.replace(/\w+-/, ''),
                                additionalMargin: 0,
                                clearer         : clearer,
                                member          : row.member,
                                account         : row.account
                            }, member);
                        }

                        if (!classes[marginClass]) {
                            classes[marginClass] = true;
                            tree.add({
                                id              : marginClass,
                                text            : marginClass.replace(/\w+-/, ''),
                                additionalMargin: 0,
                                clearer         : clearer,
                                member          : row.member,
                                account         : row.account,
                                marginClass     : row.marginClass
                            }, account);
                        }

                        tree.add({
                            id              : marginCurrency,
                            text            : marginCurrency.replace(/\w+-/, ''),
                            additionalMargin: row.additionalMargin,
                            clearer         : clearer,
                            member          : row.member,
                            account         : row.account,
                            marginClass     : row.marginClass,
                            marginCurrency  : row.marginCurrency
                        }, marginClass);
                    });

                    tree.traverseBF((node: LiquiGroupMarginTreeNode) => {
                        if (node.children && node.children.length === 1 && !!node.parent) {
                            let parentChildren = node.parent.children;
                            parentChildren.splice(parentChildren.indexOf(node), 1);
                            parentChildren.push(node.children[0]);
                            node.children[0].parent = node.parent;
                        }
                    });

                    tree.traverseDF((node: LiquiGroupMarginTreeNode) => {
                        node.children.sort((a, b) => {
                            return b.data.additionalMargin - a.data.additionalMargin;
                        });
                    });

                    tree.traverseBF((node: LiquiGroupMarginTreeNode) => {
                        let restNode = new LiquiGroupMarginTreeNode({
                            id              : node.data.id + '-Rest',
                            text            : 'Rest',
                            additionalMargin: 0,
                            clearer         : node.data.clearer,
                            member          : node.data.member,
                            account         : node.data.account,
                            marginClass     : node.data.marginClass,
                            marginCurrency  : node.data.marginCurrency
                        });
                        restNode.parent = node;
                        let aggregateCount = Math.max(node.children.length - 10, 0);
                        if (aggregateCount > 1) {
                            for (let i = 0; i < aggregateCount; i++) {
                                let childNode = node.children.pop();
                                restNode.data.additionalMargin += childNode.data.additionalMargin;
                                restNode.children.unshift(childNode);
                                childNode.parent = restNode;
                            }
                            if (restNode.children.length > 0) {
                                node.children.push(restNode);
                            }
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