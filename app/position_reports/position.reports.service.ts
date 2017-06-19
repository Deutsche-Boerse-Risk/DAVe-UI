import {Injectable} from '@angular/core';

import {DateUtils, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {Observable} from 'rxjs/Observable';

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

export const chartsURL: string = '/pr/latest';
export const latestURL: string = '/pr/latest';
export const historyURL: string = '/pr/history';

@Injectable()
export class PositionReportsService {

    constructor(private http: HttpService<PositionReportServerData[]>) {
    }

    public getPositionReportsChartData(): Observable<PositionReportChartData> {
        return this.http.get({resourceURL: chartsURL}).map((data: PositionReportServerData[]) => {
            let chartRecords: PositionReportBubble[] = [];
            let selection: PositionReportChartDataSelect = new PositionReportChartDataSelect();

            if (data) {
                data.reduce((bubblesMap: Map<string, PositionReportBubble>, record: PositionReportServerData) => {
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
        });
    }

    public getPositionReportLatest(params: PositionReportsParams): Observable<PositionReportData[]> {
        return this.loadData(latestURL, params);
    }

    public getPositionReportHistory(params: PositionReportsHistoryParams): Observable<PositionReportData[]> {
        return this.loadData(historyURL, params);
    }

    private loadData(url: string, params: PositionReportsParams) {
        return this.http.get({
            resourceURL: url,
            params     : params
        }).map((data: PositionReportServerData[]) => data || [])
            .map((data: PositionReportServerData[]) => data.map(PositionReportsService.processPositionReportsDataRow));
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