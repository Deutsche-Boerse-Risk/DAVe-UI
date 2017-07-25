import {catchOperator, map} from '@angular/cdk';
import {Injectable} from '@angular/core';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {DateUtils, RxChain, StrictRxChain, UIDUtils} from '@dbg-riskit/dave-ui-common';

import {Observable} from 'rxjs/Observable';

import {
    LiquiGroupSplitMarginData,
    LiquiGroupSplitMarginHistoryParams,
    LiquiGroupSplitMarginParams,
    LiquiGroupSplitMarginServerData
} from './liqui.group.split.margin.types';

import {AbstractService} from 'app/abstract.service';
import {ErrorCollectorService} from '../error/error.collector';
import {PeriodicHttpService} from '../periodic.http.service';

import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subscription} from 'rxjs/Subscription';

export const liquiGroupSplitMarginLatestURL: string = '/api/v1.0/lgsm/latest';
export const liquiGroupSplitMarginHistoryURL: string = '/api/v1.0/lgsm/history';

@Injectable()
export class LiquiGroupSplitMarginService extends AbstractService {

    private latestSubject: ReplaySubject<LiquiGroupSplitMarginData[]> = new ReplaySubject(1);
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
            .call(catchOperator, (err: any) => this.errorCollector.handleStreamError(err))
            .subscribe((data: LiquiGroupSplitMarginData[]) => this.latestSubject.next(data));
    }

    public getLiquiGroupSplitMarginLatest(params: LiquiGroupSplitMarginParams): Observable<LiquiGroupSplitMarginData[]> {
        return RxChain.from(this.latestSubject)
            .call(map, (data: LiquiGroupSplitMarginData[]) => {
                return data.filter((row: LiquiGroupSplitMarginData) => {
                    return Object.keys(params).every(
                        (key: keyof LiquiGroupSplitMarginParams) => params[key] === '*' || params[key] == null || params[key] == row[key]);
                });
            })
            .call(catchOperator,
                (err: any) => this.errorCollector.handleStreamError(err) as Observable<LiquiGroupSplitMarginData[]>)
            .result();
    }

    public getLiquiGroupSplitMarginHistory(params: LiquiGroupSplitMarginHistoryParams): Observable<LiquiGroupSplitMarginData[]> {
        return this.loadData(liquiGroupSplitMarginHistoryURL, params)
            .call(catchOperator,
                (err: any) => this.errorCollector.handleStreamError(err) as Observable<LiquiGroupSplitMarginData[]>)
            .result();
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