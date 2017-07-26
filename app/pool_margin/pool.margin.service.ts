import {map} from '@angular/cdk';
import {Injectable} from '@angular/core';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {DateUtils, ReplaySubjectExt, RxChain, StrictRxChain, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';

import {
    PoolMarginData,
    PoolMarginHistoryParams,
    PoolMarginParams,
    PoolMarginServerData,
    PoolMarginSummaryData
} from './pool.margin.types';

import {AbstractService} from '../abstract.service';
import {PeriodicHttpService} from '../periodic.http.service';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Subscriber} from 'rxjs/Subscriber';
import {of as observableOf} from 'rxjs/observable/of';

export const poolMarginLatestURL: string = '/api/v1.0/pm/latest';
export const poolMarginHistoryURL: string = '/api/v1.0/pm/history';

@Injectable()
export class PoolMarginService extends AbstractService {

    private latestSubject: ReplaySubjectExt<PoolMarginData[]> = new ReplaySubjectExt(1);
    private summarySubject: ReplaySubjectExt<PoolMarginSummaryData> = new ReplaySubjectExt(1);
    private latestSubscription: Subscription;

    constructor(private http: PeriodicHttpService<PoolMarginServerData[]>,
        private errorCollector: ErrorCollectorService, authService: AuthService) {
        super();
        this.setup(authService);
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

    public setupPeriodicTimer(): void {
        this.setupLatestLoader();
        this.setupSummaryLoader();
    }

    private setupLatestLoader(): void {
        this.latestSubscription = this.loadData(poolMarginLatestURL)
            .subscribe((data: PoolMarginData[]) => this.latestSubject.next(data));
    }

    private setupSummaryLoader(): void {
        RxChain.from(this.latestSubject)
            .guardedDeferredMap(
                (data: PoolMarginServerData[], subscriber: Subscriber<PoolMarginSummaryData>) => {
                    if (!data || !data.length) {
                        subscriber.next({} as PoolMarginSummaryData);
                        subscriber.complete();
                        return;
                    }
                    let result: PoolMarginSummaryData = {
                        shortfallSurplus : 0,
                        marginRequirement: 0,
                        totalCollateral  : 0,
                        cashBalance      : 0
                    };

                    data.forEach((record: PoolMarginServerData) => {
                        result.shortfallSurplus += record.overUnderInMarginCurr;
                        result.marginRequirement += record.requiredMargin;
                        result.totalCollateral += record.cashCollateralAmount + record.adjustedSecurities
                            + record.adjustedGuarantee + record.variPremInMarginCurr;
                        result.cashBalance += record.cashCollateralAmount + record.variPremInMarginCurr;
                    });
                    subscriber.next(result);
                    subscriber.complete();
                },
                (err: any) => {
                    if (!this.summarySubject.hasData) {
                        this.summarySubject.next({} as PoolMarginSummaryData);
                    }
                    return this.errorCollector.handleStreamError(err);
                })
            .subscribe((data: PoolMarginSummaryData) => this.summarySubject.next(data));
    }

    public getPoolMarginSummaryData(): Observable<PoolMarginSummaryData | {}> {
        return this.summarySubject;
    }

    public getPoolMarginLatest(params: PoolMarginParams): Observable<PoolMarginData[]> {
        return RxChain.from(this.latestSubject)
            .guardedDeferredMap(
                (data: PoolMarginData[], subscriber: Subscriber<PoolMarginData[]>) => {
                    subscriber.next(data.filter((row: PoolMarginData) => {
                        return Object.keys(params).every(
                            (key: keyof PoolMarginParams) => params[key] === '*' || params[key] == null || params[key] == row[key]);
                    }));
                    subscriber.complete();
                },
                (err: any) => {
                    this.errorCollector.handleStreamError(err);
                    return observableOf([]);
                })
            .result();
    }

    public getPoolMarginHistory(params: PoolMarginHistoryParams): Observable<PoolMarginData[]> {
        return this.loadData(poolMarginHistoryURL, params).result();
    }

    private loadData(url: string, params?: PoolMarginParams): StrictRxChain<PoolMarginData[]> {
        return this.http.get({
            resourceURL: url,
            params     : params
        }).call(map, (data: PoolMarginServerData[]) => data || [])
            .call(map, (data: PoolMarginServerData[]) => data.map(PoolMarginService.processPoolMarginData));
    }

    private static processPoolMarginData(record: PoolMarginServerData): PoolMarginData {
        return {
            uid     : UIDUtils.computeUID(record.clearer, record.pool, record.marginCurrency, record.snapshotID),
            ...record,
            received: DateUtils.utcTimestampToDate(record.timestamp)
        };
    }
}