import {Injectable} from '@angular/core';

import {DateUtils, UIDUtils} from '@dbg-riskit/DAVe-UI-common';
import {HttpService} from '@dbg-riskit/DAVe-UI-http';

import {Observable} from 'rxjs/Observable';

import {
    RiskLimitUtilizationServerData,
    RiskLimitUtilizationData,
    RiskLimitUtilizationParams,
    RiskLimitUtilizationHistoryParams
} from './risk.limit.utilization.types';

export const riskLimitUtilizationLatestURL: string = '/rlu/latest';
export const riskLimitUtilizationHistoryURL: string = '/rlu/history';

@Injectable()
export class RiskLimitUtilizationService {

    constructor(private http: HttpService<RiskLimitUtilizationServerData[]>) {
    }

    public getRiskLimitUtilizationLatest(params: RiskLimitUtilizationParams): Observable<RiskLimitUtilizationData[]> {
        return this.loadData(riskLimitUtilizationLatestURL, params);
    }

    public getRiskLimitUtilizationHistory(params: RiskLimitUtilizationHistoryParams): Observable<RiskLimitUtilizationData[]> {
        return this.loadData(riskLimitUtilizationHistoryURL, params);
    }

    private loadData(url: string, params: RiskLimitUtilizationParams): Observable<RiskLimitUtilizationData[]> {
        return this.http.get({
            resourceURL: url,
            params     : params
        }).map((data: RiskLimitUtilizationServerData[]) => data || [])
            .map((data: RiskLimitUtilizationServerData[]) => data.map(
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