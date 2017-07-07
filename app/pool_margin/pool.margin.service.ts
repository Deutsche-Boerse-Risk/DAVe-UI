import {map} from '@angular/cdk';
import {Injectable} from '@angular/core';

import {DateUtils, RxChain, StrictRxChain, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {Observable} from 'rxjs/Observable';

import {
    PoolMarginData,
    PoolMarginHistoryParams,
    PoolMarginParams,
    PoolMarginServerData,
    PoolMarginSummaryData
} from './pool.margin.types';

export const poolMarginLatestURL: string = '/api/v1.0/pm/latest';
export const poolMarginHistoryURL: string = '/api/v1.0/pm/history';

@Injectable()
export class PoolMarginService {

    constructor(private http: HttpService<PoolMarginServerData[]>) {
    }

    public getPoolMarginSummaryData(): Observable<PoolMarginSummaryData | {}> {
        return RxChain.from(this.http.get({resourceURL: poolMarginLatestURL}))
            .call(map, (data: PoolMarginServerData[]) => {
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
            }).result();
    }

    public getPoolMarginLatest(params: PoolMarginParams): Observable<PoolMarginData[]> {
        return this.loadData(poolMarginLatestURL, params).result();
    }

    public getPoolMarginHistory(params: PoolMarginHistoryParams): Observable<PoolMarginData[]> {
        return this.loadData(poolMarginHistoryURL, params).result();
    }

    private loadData(url: string, params: PoolMarginParams): StrictRxChain<PoolMarginData[]> {
        return RxChain.from(this.http.get({
            resourceURL: url,
            params     : params
        })).call(map, (data: PoolMarginServerData[]) => data || [])
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