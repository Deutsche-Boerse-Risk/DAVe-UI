import {map} from '@angular/cdk';
import {Injectable} from '@angular/core';

import {DateUtils, RxChain, StrictRxChain, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {Observable} from 'rxjs/Observable';

import {
    RiskLimitUtilizationData,
    RiskLimitUtilizationHistoryParams,
    RiskLimitUtilizationParams,
    RiskLimitUtilizationServerData
} from './risk.limit.utilization.types';

export const riskLimitUtilizationLatestURL: string = '/api/v1.0/rlu/latest';
export const riskLimitUtilizationHistoryURL: string = '/api/v1.0/rlu/history';

@Injectable()
export class RiskLimitUtilizationService {

    constructor(private http: HttpService<RiskLimitUtilizationServerData[]>) {
    }

    public getRiskLimitUtilizationLatest(params: RiskLimitUtilizationParams): Observable<RiskLimitUtilizationData[]> {
        return this.loadData(riskLimitUtilizationLatestURL, params).result();
    }

    public getRiskLimitUtilizationHistory(params: RiskLimitUtilizationHistoryParams): Observable<RiskLimitUtilizationData[]> {
        return this.loadData(riskLimitUtilizationHistoryURL, params).result();
    }

    private loadData(url: string, params: RiskLimitUtilizationParams): StrictRxChain<RiskLimitUtilizationData[]> {
        return RxChain.from(this.http.get({
            resourceURL: url,
            params     : params
        })).call(map, (data: RiskLimitUtilizationServerData[]) => data || [])
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