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

    private latestSubject: ReplaySubjectExt<PoolMarginData[]> = new ReplaySubjectExt<PoolMarginData[]>(1);
    private summarySubject: ReplaySubjectExt<PoolMarginSummaryData[]> = new ReplaySubjectExt<PoolMarginSummaryData[]>(
        1);
    private latestSubscription: Subscription;
    private summarySubscription: Subscription;

    constructor(private http: PeriodicHttpService<PoolMarginServerData[]>,
        private errorCollector: ErrorCollectorService,
        @Inject(AUTH_PROVIDER) authProvider: AuthProvider) {
        super();
        this.setup(authProvider);
    }

    /**
     * @deprecated Use for tests only
     */
    public destroyPeriodicTimer(): void {
        if (this.latestSubscription) {
            this.latestSubscription.unsubscribe();
            this.latestSubscription = null;
        }
        if (this.summarySubscription) {
            this.summarySubscription.unsubscribe();
            this.summarySubscription = null;
        }
    }

    public setupPeriodicTimer(): void {
        this.setupLatestLoader();
        this.setupSummaryLoader();
    }

    private setupLatestLoader(): void {
        this.latestSubscription = this.loadData(poolMarginLatestURL,
            () => {
                if (!this.latestSubject.hasData) {
                    this.latestSubject.next([]);
                }
            })
            .subscribe((data: PoolMarginData[]) => this.latestSubject.next(data));
    }

    private setupSummaryLoader(): void {
        this.summarySubscription = RxChain.from(this.latestSubject)
            .guardedDeferredMap(
                (data: PoolMarginServerData[], subscriber: Subscriber<PoolMarginSummaryData[]>) => {
                    if (!data) {
                        subscriber.next([]);
                        subscriber.complete();
                        return;
                    }

                    let result: { [key: string]: PoolMarginSummaryData } = {};

                    data.forEach((record: PoolMarginServerData) => {
                        let pool: PoolMarginSummaryData = result[record.pool];
                        if (!pool) {
                            pool = {
                                pool             : record.pool,
                                shortfallSurplus : 0,
                                marginRequirement: 0,
                                cashBalance      : 0
                            };
                            result[record.pool] = pool;
                        }

                        pool.shortfallSurplus += record.overUnderInClrRptCurr;
                        pool.marginRequirement += record.requiredMargin * record.adjustedExchangeRate;
                        pool.cashBalance += record.cashCollateralAmount * record.adjustedExchangeRate;
                    });

                    subscriber.next(Object.keys(result).reduce((summaryData: PoolMarginSummaryData[], key: string) => {
                        summaryData.push(result[key]);
                        return summaryData;
                    }, []));
                    subscriber.complete();
                },
                (err: any) => {
                    if (!this.summarySubject.hasData) {
                        this.summarySubject.next([]);
                    }
                    return this.errorCollector.handleStreamError(err);
                })
            .subscribe((data: PoolMarginSummaryData[]) => this.summarySubject.next(data));
    }

    public getPoolMarginSummaryData(): Observable<PoolMarginSummaryData[]> {
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
                });
    }

    public getPoolMarginHistory(params: PoolMarginHistoryParams): Observable<PoolMarginData[]> {
        let first = true;
        return this.loadData(poolMarginHistoryURL, () => first ? [] : null, params).call(map,
            (data: PoolMarginData[]) => {
                first = false;
                return data;
            });
    }

    private loadData(url: string, errorHandler: () => any, params?: PoolMarginParams): StrictRxChain<PoolMarginData[]> {
        return this.http.get({
            resourceURL: url,
            params     : params
        }, errorHandler).call(map, (data: PoolMarginServerData[]) => data || [])
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