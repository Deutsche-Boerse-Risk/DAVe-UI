import {Injectable} from '@angular/core';

import {DateUtils, UIDUtils} from '@dbg-riskit/DAVe-UI-common';
import {HttpService} from '@dbg-riskit/DAVe-UI-http';

import {Observable} from 'rxjs/Observable';

import {
    LiquiGroupSplitMarginData,
    LiquiGroupSplitMarginHistoryParams,
    LiquiGroupSplitMarginParams,
    LiquiGroupSplitMarginServerData
} from './liqui.group.split.margin.types';

export const liquiGroupSplitMarginLatestURL: string = '/lgsm/latest';
export const liquiGroupSplitMarginHistoryURL: string = '/lgsm/history';

@Injectable()
export class LiquiGroupSplitMarginService {

    constructor(private http: HttpService<LiquiGroupSplitMarginServerData[]>) {
    }

    public getLiquiGroupSplitMarginLatest(params: LiquiGroupSplitMarginParams): Observable<LiquiGroupSplitMarginData[]> {
        return this.loadData(liquiGroupSplitMarginLatestURL, params);
    }

    public getLiquiGroupSplitMarginHistory(params: LiquiGroupSplitMarginHistoryParams): Observable<LiquiGroupSplitMarginData[]> {
        return this.loadData(liquiGroupSplitMarginHistoryURL, params);
    }

    private loadData(url: string, params: LiquiGroupSplitMarginParams): Observable<LiquiGroupSplitMarginData[]> {
        return this.http.get({
            resourceURL: url,
            params     : params
        }).map((data: LiquiGroupSplitMarginServerData[]) => data || [])
            .map((data: LiquiGroupSplitMarginServerData[]) => data.map(
                LiquiGroupSplitMarginService.processLiquiGroupSplitMarginData));
    }

    private static processLiquiGroupSplitMarginData(record: LiquiGroupSplitMarginServerData): LiquiGroupSplitMarginData {
        return {
            uid             : UIDUtils.computeUID(record.clearer, record.member, record.account,
                record.liquidationGroup,
                record.liquidationGroupSplit, record.marginCurrency, record.snapshotID),
            ...record,
            additionalMargin: (record.marketRisk || 0) + (record.liquRisk || 0) + (record.longOptionCredit || 0),
            received        : DateUtils.utcTimestampToDate(record.timestamp)
        };
    }
}