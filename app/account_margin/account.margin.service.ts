import {catchOperator, map} from '@angular/cdk';
import {Injectable} from '@angular/core';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {DateUtils, RxChain, UIDUtils} from '@dbg-riskit/dave-ui-common';

import {Observable} from 'rxjs/Observable';

import {
    AccountMarginData,
    AccountMarginHistoryParams,
    AccountMarginParams,
    AccountMarginServerData
} from './account.margin.types';

import {AbstractService} from '../abstract.service';
import {ErrorCollectorService} from '../error/error.collector';
import {PeriodicHttpService} from '../periodic.http.service';

import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subscription} from 'rxjs/Subscription';

export const accountMarginLatestURL: string = '/api/v1.0/am/latest';
export const accountMarginHistoryURL: string = '/api/v1.0/am/history';

@Injectable()
export class AccountMarginService extends AbstractService {

    private latestSubject: ReplaySubject<AccountMarginData[]> = new ReplaySubject(1);
    private latestSubscription: Subscription;

    constructor(private http: PeriodicHttpService<AccountMarginServerData[]>,
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
        this.latestSubscription = this.loadData(accountMarginLatestURL)
            .call(catchOperator, (err: any) => this.errorCollector.handleStreamError(err))
            .subscribe((data: AccountMarginData[]) => this.latestSubject.next(data));
    }

    public getAccountMarginLatest(params: AccountMarginParams): Observable<AccountMarginData[]> {
        return RxChain.from(this.latestSubject)
            .call(map, (data: AccountMarginData[]) => {
                return data.filter((row: AccountMarginData) => {
                    return Object.keys(params).every(
                        (key: keyof AccountMarginParams) => params[key] === '*' || params[key] == null || params[key] == row[key]);
                });
            })
            .call(catchOperator,
                (err: any) => this.errorCollector.handleStreamError(err) as Observable<AccountMarginData[]>)
            .result();
    }

    public getAccountMarginHistory(params: AccountMarginHistoryParams): Observable<AccountMarginData[]> {
        return this.loadData(accountMarginHistoryURL, params)
            .call(catchOperator,
                (err: any) => this.errorCollector.handleStreamError(err) as Observable<AccountMarginData[]>)
            .result();
    }

    private loadData(url: string, params?: AccountMarginParams) {
        return this.http.get({
            resourceURL: url,
            params     : params
        }).call(map, (data: AccountMarginServerData[]) => data || [])
            .call(map, (data: AccountMarginServerData[]) =>
                data.map(AccountMarginService.processAccountMarginDataRow));
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