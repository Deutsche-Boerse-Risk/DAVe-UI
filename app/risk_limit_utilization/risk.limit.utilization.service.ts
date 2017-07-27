import {map} from '@angular/cdk';
import {Injectable} from '@angular/core';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {DateUtils, ReplaySubjectExt, RxChain, StrictRxChain, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';

import {
    RiskLimitUtilizationData,
    RiskLimitUtilizationHistoryParams,
    RiskLimitUtilizationParams,
    RiskLimitUtilizationServerData
} from './risk.limit.utilization.types';

import {AbstractService} from '../abstract.service';
import {PeriodicHttpService} from '../periodic.http.service';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Subscriber} from 'rxjs/Subscriber';
import {of as observableOf} from 'rxjs/observable/of';

export const riskLimitUtilizationLatestURL: string = '/api/v1.0/rlu/latest';
export const riskLimitUtilizationHistoryURL: string = '/api/v1.0/rlu/history';

@Injectable()
export class RiskLimitUtilizationService extends AbstractService {

    private latestSubject: ReplaySubjectExt<RiskLimitUtilizationData[]> = new ReplaySubjectExt(1);
    private latestSubscription: Subscription;

    constructor(private http: PeriodicHttpService<RiskLimitUtilizationServerData[]>,
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
        this.latestSubscription = this.loadData(riskLimitUtilizationLatestURL,
            () => {
                if (!this.latestSubject.hasData) {
                    this.latestSubject.next([]);
                }
            })
            .subscribe((data: RiskLimitUtilizationData[]) => this.latestSubject.next(data));
    }

    public getRiskLimitUtilizationLatest(params: RiskLimitUtilizationParams): Observable<RiskLimitUtilizationData[]> {
        return RxChain.from(this.latestSubject)
            .guardedDeferredMap(
                (data: RiskLimitUtilizationData[], subscriber: Subscriber<RiskLimitUtilizationData[]>) => {
                    subscriber.next(data.filter((row: RiskLimitUtilizationData) => {
                        return Object.keys(params).every(
                            (key: keyof RiskLimitUtilizationParams) => params[key] === '*' || params[key] == null || params[key] == row[key]);
                    }));
                    subscriber.complete();
                },
                (err: any) => {
                    this.errorCollector.handleStreamError(err);
                    return observableOf([]);
                })
            .result();
    }

    public getRiskLimitUtilizationHistory(params: RiskLimitUtilizationHistoryParams): Observable<RiskLimitUtilizationData[]> {
        let first = true;
        return this.loadData(riskLimitUtilizationHistoryURL, () => first ? [] : null, params).call(map,
            (data: RiskLimitUtilizationData[]) => {
                first = false;
                return data;
            }).result();
    }

    private loadData(url: string, errorHandler: () => any,
        params?: RiskLimitUtilizationParams): StrictRxChain<RiskLimitUtilizationData[]> {
        return this.http.get({
            resourceURL: url,
            params     : params
        }, errorHandler).call(map, (data: RiskLimitUtilizationServerData[]) => data || [])
            .call(map, (data: RiskLimitUtilizationServerData[]) => data.map(
                RiskLimitUtilizationService.processRiskLimitUtilizationDataRow));
    }

    private static processRiskLimitUtilizationDataRow(record: RiskLimitUtilizationServerData): RiskLimitUtilizationData {
        let warningUtil: number, throttleUtil: number, rejectUtil: number;
        if (record.warningLevel > 0) {
            warningUtil = record.utilization / record.warningLevel * 100;
        }

        if (record.throttleLevel > 0) {
            throttleUtil = record.utilization / record.throttleLevel * 100;
        }

        if (record.rejectLevel > 0) {
            rejectUtil = record.utilization / record.rejectLevel * 100;
        }
        return {
            uid         : UIDUtils.computeUID(record.clearer, record.member, record.maintainer, record.limitType,
                record.snapshotID),
            ...record,
            warningUtil : warningUtil,
            throttleUtil: throttleUtil,
            rejectUtil  : rejectUtil,
            received    : DateUtils.utcTimestampToDate(record.timestamp)
        };
    }
}