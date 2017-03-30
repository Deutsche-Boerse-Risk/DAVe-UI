import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {Observable} from 'rxjs/Observable';
import {UIDUtils} from '../uid.utils';
import {parseServerDate} from '../date.utils';

import {
    LiquiGroupMarginServerData,
    LiquiGroupMarginData,
    LiquiGroupMarginParams,
    LiquiGroupMarginHistoryParams
} from './liqui.group.margin.types';

export const liquiGroupMarginLatestURL: string = '/lgm/latest';
export const liquiGroupMarginHistoryURL: string = '/lgm/history';

@Injectable()
export class LiquiGroupMarginService {

    constructor(private http: HttpService<LiquiGroupMarginServerData[]>) {
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