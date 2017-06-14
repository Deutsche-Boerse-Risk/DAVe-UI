import {Injectable} from '@angular/core';

import {DateUtils, UIDUtils} from '@dbg-riskit/DAVe-UI-common';
import {HttpService} from '@dbg-riskit/DAVe-UI-http';

import {Observable} from 'rxjs/Observable';

import {
    AccountMarginData,
    AccountMarginHistoryParams,
    AccountMarginParams,
    AccountMarginServerData
} from './account.margin.types';

export const accountMarginLatestURL: string = '/am/latest';
export const accountMarginHistoryURL: string = '/am/history';

@Injectable()
export class AccountMarginService {

    constructor(private http: HttpService<AccountMarginServerData[]>) {
    }

    public getAccountMarginLatest(params: AccountMarginParams): Observable<AccountMarginData[]> {
        return this.loadData(accountMarginLatestURL, params);
    }

    public getAccountMarginHistory(params: AccountMarginHistoryParams): Observable<AccountMarginData[]> {
        return this.loadData(accountMarginHistoryURL, params);
    }

    private loadData(url: string, params: AccountMarginParams) {
        return this.http.get({
            resourceURL: url,
            params     : params
        }).map((data: AccountMarginServerData[]) => data || [])
            .map((data: AccountMarginServerData[]) => data.map(AccountMarginService.processAccountMarginDataRow));
    }

    private static processAccountMarginDataRow(record: AccountMarginServerData): AccountMarginData {
        return {
            uid     : UIDUtils.computeUID(record.clearer, record.member, record.account, record.marginCurrency,
                record.snapshotID),
            ...record,
            received: DateUtils.utcTimestampToDate(record.timestamp)
        };
    }
}