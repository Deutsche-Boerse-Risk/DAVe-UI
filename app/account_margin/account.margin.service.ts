import {map} from '@angular/cdk';
import {Inject, Injectable} from '@angular/core';

import {AUTH_PROVIDER, AuthProvider, DateUtils, ReplaySubjectExt, RxChain, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';

import {
    AccountMarginData,
    AccountMarginHistoryParams,
    AccountMarginParams,
    AccountMarginServerData
} from './account.margin.types';

import {AbstractService} from '../abstract.service';
import {PeriodicHttpService} from '../periodic.http.service';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Subscriber} from 'rxjs/Subscriber';
import {of as observableOf} from 'rxjs/observable/of';

export const accountMarginLatestURL: string = '/api/v1.0/am/latest';
export const accountMarginHistoryURL: string = '/api/v1.0/am/history';

@Injectable()
export class AccountMarginService extends AbstractService {

    private latestSubject: ReplaySubjectExt<AccountMarginData[]> = new ReplaySubjectExt<AccountMarginData[]>(1);
    private latestSubscription: Subscription;

    constructor(private http: PeriodicHttpService<AccountMarginServerData[]>,
        private errorCollector: ErrorCollectorService,
        @Inject(AUTH_PROVIDER) authProvider: AuthProvider) {
        super();
        this.setup(authProvider);
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
        this.latestSubscription = this.loadData(accountMarginLatestURL,
            () => {
                if (!this.latestSubject.hasData) {
                    this.latestSubject.next([]);
                }
            })
            .subscribe((data: AccountMarginData[]) => this.latestSubject.next(data));
    }

    public getAccountMarginLatest(params: AccountMarginParams): Observable<AccountMarginData[]> {
        return RxChain.from(this.latestSubject)
            .guardedDeferredMap(
                (data: AccountMarginData[], subscriber: Subscriber<AccountMarginData[]>) => {
                    subscriber.next(data.filter((row: AccountMarginData) => {
                        return Object.keys(params).every(
                            (key: keyof AccountMarginParams) => params[key] === '*' || params[key] == null || params[key] == row[key]);
                    }));
                    subscriber.complete();
                },
                (err: any) => {
                    this.errorCollector.handleStreamError(err);
                    return observableOf([]);
                });
    }

    public getAccountMarginHistory(params: AccountMarginHistoryParams): Observable<AccountMarginData[]> {
        let first = true;
        return this.loadData(accountMarginHistoryURL, () => first ? [] : null, params).call(map,
            (data: AccountMarginData[]) => {
                first = false;
                return data;
            });
    }

    private loadData(url: string, errorHandler: () => any, params?: AccountMarginParams) {
        return this.http.get({
            resourceURL: url,
            params     : params
        }, errorHandler).call(map, (data: AccountMarginServerData[]) => data || [])
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