import {catchOperator, map} from '@angular/cdk';
import {Injectable} from '@angular/core';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {DateUtils, RxChain, StrictRxChain, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';

import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';

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

import {Subscription} from 'rxjs/Subscription';

export const latestURL: string = '/api/v1.0/pr/latest';
export const historyURL: string = '/api/v1.0/pr/history';

@Injectable()
export class PositionReportsService extends AbstractService {

    private latestSubject: ReplaySubject<PositionReportData[]> = new ReplaySubject(1);
    private chartsSubject: ReplaySubject<PositionReportChartData> = new ReplaySubject(1);
    private latestSubscription: Subscription;

    constructor(private http: PeriodicHttpService<PositionReportServerData[]>,
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
        this.setupLatestLoader();
        this.setupChartsDataLoader();
    }

    private setupLatestLoader(): void {
        this.latestSubscription = this.loadData(latestURL)
            .call(catchOperator, (err: any) => this.errorCollector.handleStreamError(err))
            .subscribe((data: PositionReportData[]) => this.latestSubject.next(data));
    }

    private setupChartsDataLoader() {
        RxChain.from(this.latestSubject)
            .call(map, (data: PositionReportData[]) => {
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
                return {
                    bubbles         : chartRecords,
                    selection       : selection,
                    memberSelection : options[0],
                    accountSelection: options[0]
                };
            })
            .call(catchOperator, (err: any) => this.errorCollector.handleStreamError(err))
            .subscribe((chartData: PositionReportChartData) => this.chartsSubject.next(chartData));
    }

    public getPositionReportsChartData(): Observable<PositionReportChartData> {
        return this.chartsSubject;
    }

    public getPositionReportLatest(params: PositionReportsParams): Observable<PositionReportData[]> {
        return RxChain.from(this.latestSubject)
            .call(map, (data: PositionReportData[]) => {
                return data.filter((row: PositionReportData) => {
                    return Object.keys(params).every(
                        (key: keyof PositionReportsParams) => params[key] === '*' || params[key] == null || params[key] == row[key]);
                });
            })
            .call(catchOperator,
                (err: any) => this.errorCollector.handleStreamError(err) as Observable<PositionReportData[]>)
            .result();
    }

    public getPositionReportHistory(params: PositionReportsHistoryParams): Observable<PositionReportData[]> {
        return this.loadData(historyURL, params)
            .call(catchOperator,
                (err: any) => this.errorCollector.handleStreamError(err) as Observable<PositionReportData[]>)
            .result();
    }

    private loadData(url: string, params?: PositionReportsParams): StrictRxChain<PositionReportData[]> {
        return this.http.get({
            resourceURL: url,
            params     : params
        }).call(map, (data: PositionReportServerData[]) => data || [])
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