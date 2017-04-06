import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {Observable} from 'rxjs/Observable';
import {UIDUtils} from '../uid.utils';
import {parseServerDate} from '../date.utils';

import {
    LiquiGroupMarginServerData,
    LiquiGroupMarginData,
    LiquiGroupMarginBaseData,
    LiquiGroupMarginAggregationData,
    LiquiGroupMarginParams,
    LiquiGroupMarginHistoryParams
} from './liqui.group.margin.types';

export const liquiGroupMarginAggregationURL: string = '/lgm/latest';
export const liquiGroupMarginLatestURL: string = '/lgm/latest';
export const liquiGroupMarginHistoryURL: string = '/lgm/history';

@Injectable()
export class LiquiGroupMarginService {

    constructor(private http: HttpService<LiquiGroupMarginServerData[]>) {
    }

    public getLiquiGroupMarginAggregationData(): Observable<LiquiGroupMarginAggregationData> {
        return this.http.get({resourceURL: liquiGroupMarginAggregationURL}).map(
            (data: LiquiGroupMarginServerData[]) => {
                if (!data) {
                    return {};
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
                            received: parseServerDate(record.timestamp)
                        };
                    }
                });

                return {
                    aggregatedRows: Object.keys(newViewWindow).map((key: string) => {
                        return newViewWindow[key];
                    }),
                    summary       : footerData
                };
            });
    }

    public getLiquiGroupMarginLatest(params: LiquiGroupMarginParams): Observable<LiquiGroupMarginData[]> {
        return this.loadData(liquiGroupMarginLatestURL, params);
    }

    public getLiquiGroupMarginHistory(params: LiquiGroupMarginHistoryParams): Observable<LiquiGroupMarginData[]> {
        return this.loadData(liquiGroupMarginHistoryURL, params);
    }

    private loadData(url: string, params: LiquiGroupMarginParams): Observable<LiquiGroupMarginData[]> {
        return this.http.get({
            resourceURL: url,
            params     : params
        }).map((data: LiquiGroupMarginServerData[]) => data || [])
            .map((data: LiquiGroupMarginServerData[]) => data.map(LiquiGroupMarginService.processLiquiGroupMarginData));
    }

    private static processLiquiGroupMarginData(record: LiquiGroupMarginServerData): LiquiGroupMarginData {
        return {
            uid     : UIDUtils.computeUID(record.clearer, record.member, record.account, record.marginClass,
                record.marginCurrency, record.snapshotID),
            ...record,
            received: parseServerDate(record.timestamp)
        };
    }
}