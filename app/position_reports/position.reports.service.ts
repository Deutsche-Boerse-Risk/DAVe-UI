import {map} from '@angular/cdk';
import {Inject, Injectable} from '@angular/core';

import {
    AUTH_PROVIDER,
    AuthProvider,
    DateUtils,
    ReplaySubjectExt,
    RxChain,
    StrictRxChain,
    UIDUtils
} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';

import {AbstractService} from '../abstract.service';
import {PeriodicHttpService} from '../periodic.http.service';

import {
    PositionReportBubble,
    PositionReportChartData,
    PositionReportChartDataSelect,
    PositionReportData,
    PositionReportServerData,
    PositionReportsHistoryParams,
    PositionReportsParams,
    SelectValues
} from './position.report.types';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Subscriber} from 'rxjs/Subscriber';
import {of as observableOf} from 'rxjs/observable/of';

export const latestURL: string = '/api/v1.0/pr/latest';
export const historyURL: string = '/api/v1.0/pr/history';

@Injectable()
export class PositionReportsService extends AbstractService {

    private latestSubject: ReplaySubjectExt<PositionReportData[]> = new ReplaySubjectExt(1);
    private chartsSubject: ReplaySubjectExt<PositionReportChartData> = new ReplaySubjectExt(1);
    private latestSubscription: Subscription;

    constructor(private http: PeriodicHttpService<PositionReportServerData[]>,
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
        this.setupLatestLoader();
        this.setupChartsDataLoader();
    }

    private setupLatestLoader(): void {
        this.latestSubscription = this.loadData(latestURL,
            () => {
                if (!this.latestSubject.hasData) {
                    this.latestSubject.next([]);
                }
            })
            .subscribe((data: PositionReportData[]) => this.latestSubject.next(data));
    }

    private setupChartsDataLoader() {
        RxChain.from(this.latestSubject)
            .guardedDeferredMap(
                (data: PositionReportData[], subscriber: Subscriber<PositionReportChartData>) => {
                    let chartRecords: PositionReportBubble[] = [];
                    let selection: PositionReportChartDataSelect = new PositionReportChartDataSelect();

                    if (data) {
                        data.reduce(
                            (bubblesMap: Map<string, PositionReportBubble>, record: PositionReportData) => {
                                let memberKey = UIDUtils.computeUID(record.clearer, record.member);
                                let bubbleKey: string = UIDUtils.computeUID(memberKey, record.account, record.product,
                                    record.contractYear, record.contractMonth, record.expiryDay);

                                let bubble = {
                                    key              : bubbleKey,
                                    memberKey        : memberKey,
                                    hAxisKey         : UIDUtils.computeUID(record.product, record.contractYear,
                                        record.contractMonth, record.expiryDay),
                                    clearer          : record.clearer,
                                    member           : record.member,
                                    account          : record.account,
                                    symbol           : record.product,
                                    maturityMonthYear: '' + record.contractYear + record.contractMonth + record.expiryDay,
                                    underlying       : record.underlying,
                                    putCall          : record.callPut,
                                    radius           : record.compVar
                                };

                                if (bubblesMap.has(bubbleKey)) {
                                    bubblesMap.get(bubbleKey).radius += record.compVar;
                                } else {
                                    bubblesMap.set(bubbleKey, bubble);
                                }

                                let selectValues: SelectValues = selection.get(memberKey);

                                if (!(selectValues)) {
                                    selectValues = selection.create(memberKey);
                                    selectValues.record = bubble;
                                }

                                if (!(selectValues.subRecords.get(record.account))) {
                                    selectValues = selectValues.subRecords.create(record.account);
                                    selectValues.record = bubble;
                                }
                                return bubblesMap;
                            }, new Map())
                            .forEach((bubble: PositionReportBubble) => {
                                chartRecords.push(bubble);
                            });
                    }
                    selection.sort();
                    let options = selection.getOptions();
                    subscriber.next({
                        bubbles         : chartRecords,
                        selection       : selection,
                        memberSelection : options[0],
                        accountSelection: options[0]
                    });
                    subscriber.complete();
                },
                (err: any) => {
                    if (!this.chartsSubject.hasData) {
                        this.chartsSubject.next({
                            bubbles         : [],
                            selection       : new PositionReportChartDataSelect(),
                            memberSelection : null,
                            accountSelection: null
                        });
                    }
                    return this.errorCollector.handleStreamError(err);
                })
            .subscribe((chartData: PositionReportChartData) => this.chartsSubject.next(chartData));
    }

    public getPositionReportsChartData(): Observable<PositionReportChartData> {
        return this.chartsSubject;
    }

    public getPositionReportLatest(params: PositionReportsParams): Observable<PositionReportData[]> {
        return RxChain.from(this.latestSubject)
            .guardedDeferredMap(
                (data: PositionReportData[], subscriber: Subscriber<PositionReportData[]>) => {
                    subscriber.next(data.filter((row: PositionReportData) => {
                        return Object.keys(params).every(
                            (key: keyof PositionReportsParams) => params[key] === '*' || params[key] == null || params[key] == row[key]);
                    }));
                    subscriber.complete();
                },
                (err: any) => {
                    this.errorCollector.handleStreamError(err);
                    return observableOf([]);
                });
    }

    public getPositionReportHistory(params: PositionReportsHistoryParams): Observable<PositionReportData[]> {
        let first = true;
        return this.loadData(historyURL, () => first ? [] : null, params).call(map,
            (data: PositionReportData[]) => {
                first = false;
                return data;
            });
    }

    private loadData(url: string, errorHandler: () => any,
        params?: PositionReportsParams): StrictRxChain<PositionReportData[]> {
        return this.http.get({
            resourceURL: url,
            params     : params
        }, errorHandler).call(map, (data: PositionReportServerData[]) => data || [])
            .call(map,
                (data: PositionReportServerData[]) => data.map(PositionReportsService.processPositionReportsDataRow));
    }

    private static processPositionReportsDataRow(record: PositionReportServerData): PositionReportData {
        return {
            uid         : UIDUtils.computeUID(record.clearer, record.member, record.account, record.liquidationGroup,
                record.liquidationGroupSplit, record.product, record.callPut,
                record.contractYear,
                record.contractMonth, record.expiryDay, record.exercisePrice, record.version,
                record.flexContractSymbol, record.snapshotID),
            ...record,
            received    : DateUtils.utcTimestampToDate(record.timestamp),
            contractDate: new Date(record.contractYear, record.contractMonth - 1, record.expiryDay || 1, 0, 0, 0, 0)
        };
    }
}