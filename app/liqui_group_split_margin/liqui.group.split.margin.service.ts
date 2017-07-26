import {map} from '@angular/cdk';
import {Injectable} from '@angular/core';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {DateUtils, ReplaySubjectExt, RxChain, StrictRxChain, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';

import {
    LiquiGroupSplitMarginData,
    LiquiGroupSplitMarginHistoryParams,
    LiquiGroupSplitMarginParams,
    LiquiGroupSplitMarginServerData
} from './liqui.group.split.margin.types';

import {AbstractService} from '../abstract.service';
import {PeriodicHttpService} from '../periodic.http.service';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Subscriber} from 'rxjs/Subscriber';
import {of as observableOf} from 'rxjs/observable/of';

export const liquiGroupSplitMarginLatestURL: string = '/api/v1.0/lgsm/latest';
export const liquiGroupSplitMarginHistoryURL: string = '/api/v1.0/lgsm/history';

@Injectable()
export class LiquiGroupSplitMarginService extends AbstractService {

    private latestSubject: ReplaySubjectExt<LiquiGroupSplitMarginData[]> = new ReplaySubjectExt(1);
    private latestSubscription: Subscription;

    constructor(private http: PeriodicHttpService<LiquiGroupSplitMarginServerData[]>,
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
        this.latestSubscription = this.loadData(liquiGroupSplitMarginLatestURL)
            .subscribe((data: LiquiGroupSplitMarginData[]) => this.latestSubject.next(data));
    }

    public getLiquiGroupSplitMarginLatest(params: LiquiGroupSplitMarginParams): Observable<LiquiGroupSplitMarginData[]> {
        return RxChain.from(this.latestSubject)
            .guardedDeferredMap(
                (data: LiquiGroupSplitMarginData[], subscriber: Subscriber<LiquiGroupSplitMarginData[]>) => {
                    subscriber.next(data.filter((row: LiquiGroupSplitMarginData) => {
                        return Object.keys(params).every(
                            (key: keyof LiquiGroupSplitMarginParams) => params[key] === '*' || params[key] == null || params[key] == row[key]);
                    }));
                    subscriber.complete();
                },
                (err: any) => {
                    this.errorCollector.handleStreamError(err);
                    return observableOf([]);
                })
            .result();
    }

    public getLiquiGroupSplitMarginHistory(params: LiquiGroupSplitMarginHistoryParams): Observable<LiquiGroupSplitMarginData[]> {
        return this.loadData(liquiGroupSplitMarginHistoryURL, params).result();
    }

    private loadData(url: string, params?: LiquiGroupSplitMarginParams): StrictRxChain<LiquiGroupSplitMarginData[]> {
        return this.http.get({
            resourceURL: url,
            params     : params
        }).call(map, (data: LiquiGroupSplitMarginServerData[]) => data || [])
            .call(map, (data: LiquiGroupSplitMarginServerData[]) => data.map(
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