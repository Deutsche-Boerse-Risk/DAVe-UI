import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {Observable} from 'rxjs/Observable';
import {UIDUtils} from '../uid.utils';
import {parseServerDate} from '../date.utils';

import {
    PoolMarginServerData, PoolMarginSummaryData, PoolMarginData, PoolMarginParams, PoolMarginHistoryParams
} from './pool.margin.types';

export const poolMarginLatestURL: string = '/pm/latest';
export const poolMarginHistoryURL: string = '/pm/history';

@Injectable()
export class PoolMarginService {

    constructor(private http: HttpService<PoolMarginServerData[]>) {
    }

    public getPoolMarginSummaryData(): Observable<PoolMarginSummaryData> {
        return this.http.get({resourceURL: poolMarginLatestURL}).map(
            (data: PoolMarginServerData[]) => {
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
            });
    }

    public getPoolMarginLatest(params: PoolMarginParams): Observable<PoolMarginData[]> {
        return this.loadData(poolMarginLatestURL, params);
    }

    public getPoolMarginHistory(params: PoolMarginHistoryParams): Observable<PoolMarginData[]> {
        return this.loadData(poolMarginHistoryURL, params);
    }

    private loadData(url: string, params: PoolMarginParams): Observable<PoolMarginData[]> {
        return this.http.get({
            resourceURL: url,
            params     : params
        }).map((data: PoolMarginServerData[]) => data || [])
            .map((data: PoolMarginServerData[]) => data.map(PoolMarginService.processPoolMarginData));
    }

    private static processPoolMarginData(record: PoolMarginServerData): PoolMarginData {
        return {
            uid     : UIDUtils.computeUID(record.clearer, record.pool, record.marginCurrency, record.snapshotID),
            ...record,
            received: parseServerDate(record.timestamp)
        };
    }
}