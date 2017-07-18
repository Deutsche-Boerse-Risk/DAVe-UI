import {map} from '@angular/cdk';
import {Injectable} from '@angular/core';

import {DateUtils, RxChain, StrictRxChain, UIDUtils} from '@dbg-riskit/dave-ui-common';

import {Observable} from 'rxjs/Observable';

import {
    PoolMarginData,
    PoolMarginHistoryParams,
    PoolMarginParams,
    PoolMarginServerData,
    PoolMarginSummaryData
} from './pool.margin.types';

import {PeriodicHttpService} from '../periodic.http.service';

import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subscription} from 'rxjs/Subscription';

export const poolMarginLatestURL: string = '/api/v1.0/pm/latest';
export const poolMarginHistoryURL: string = '/api/v1.0/pm/history';

@Injectable()
export class PoolMarginService {

    private latestSubject: ReplaySubject<PoolMarginData[]> = new ReplaySubject(1);
    private summarySubject: ReplaySubject<PoolMarginData[]> = new ReplaySubject(1);
    private latestSubscription: Subscription;

    constructor(private http: PeriodicHttpService<PoolMarginServerData[]>) {
        this.setupLatestLoader();
        this.setupSummaryLoader();
    }

    /**
     * @deprecated Use for tests only
     */
    public destroyPeriodicTimer(): void {
        this.latestSubscription.unsubscribe();
    }

    private setupLatestLoader(): void {
        this.latestSubscription = this.loadData(poolMarginLatestURL)
            .subscribe(
                (data: PoolMarginData[]) => this.latestSubject.next(data),
                (err: any) => this.latestSubject.error(err));
    }

    private setupSummaryLoader(): void {
        RxChain.from(this.latestSubject).call(map, (data: PoolMarginServerData[]) => {
            if (!data) {
                return {};
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
            return result;
        }).subscribe(
            (data: PoolMarginData[]) => this.summarySubject.next(data),
            (err: any) => this.summarySubject.error(err));
    }

    public getPoolMarginSummaryData(): Observable<PoolMarginSummaryData | {}> {
        return this.summarySubject;
    }

    public getPoolMarginLatest(params: PoolMarginParams): Observable<PoolMarginData[]> {
        return RxChain.from(this.latestSubject)
            .call(map, (data: PoolMarginData[]) => {
                return data.filter((row: PoolMarginData) => {
                    return Object.keys(params).every(
                        (key: keyof PoolMarginParams) => params[key] === '*' || params[key] == null || params[key] == row[key]);
                });
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