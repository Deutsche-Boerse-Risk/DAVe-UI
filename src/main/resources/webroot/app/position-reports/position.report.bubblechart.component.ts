import {Component} from '@angular/core';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';
import {ErrorResponse} from '../abstract.http.service';

import {NUMBER_PIPE} from '../common/common.module';
import {BubbleChartOptions, ChartData, ChartRow} from '../common/chart.types';

import {PositionReportsService} from './position.reports.service';
import {
    PositionReportChartData, PositionReportBubble,
    PositionReportChartDataSelect, SelectValues
} from './position.report.types';

const compVarPositiveLegend = 'Positive';
const compVarNegativeLegend = 'Negative';

@Component({
    moduleId: module.id,
    selector: 'position-report-bubblechart',
    templateUrl: 'position.report.bubblechart.component.html',
    styleUrls: ['position.report.bubblechart.component.css'],
    host: {}
})
export class PositionReportBubbleChartComponent extends AbstractComponentWithAutoRefresh {

    public errorMessage: string;

    public title: string;

    public initialLoad: boolean = true;

    constructor(private positionReportsService: PositionReportsService) {
        super();
    }

    protected loadData(): void {
        this.positionReportsService.getPositionReportsChartData()
            .then(this.processData.bind(this))
            .catch((err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    private processData(chartData: PositionReportChartData[]): void {
        delete this.memberSelection;
        delete this.accountSelection;

        for (let i = 0; i < chartData.length; i++) {
            this.addRecordToBubbles(chartData[i]);
            this.addAccountToSelection(chartData[i]);
        }
        this.accountSelectionChanged();

        delete this.errorMessage;
        this.initialLoad = false;
    }

    //<editor-fold defaultstate="collapsed" desc="Member/Account/Bubbles count selection">

    //noinspection JSUnusedGlobalSymbols
    public topRecords: number[] = [10, 20, 30];

    public topRecordsCount: number = 20;

    public selection: PositionReportChartDataSelect = new PositionReportChartDataSelect();

    public memberSelection: PositionReportChartData;

    public accountSelection: PositionReportChartData;

    private addAccountToSelection(record: PositionReportChartData): void {
        let memberKey = record.clearer + '-' + record.member;

        let selectValues: SelectValues = this.selection.get(memberKey);

        if (!(selectValues)) {
            selectValues = this.selection.create(memberKey);
            selectValues.record = record;
            if (!this.memberSelection) {
                this.memberSelection = record;
            }
        }

        if (!(selectValues.subRecords.get(record.account))) {
            selectValues = selectValues.subRecords.create(record.account);
            selectValues.record = record;

            if (!this.accountSelection) {
                this.accountSelection = record;
            }
        }
    }

    //noinspection JSUnusedGlobalSymbols
    public memberSelectionChanged(): void {
        let memberKey = this.memberSelection.clearer + '-' + this.memberSelection.member;

        let selectValues: SelectValues = this.selection.get(memberKey);
        if (selectValues.subRecords.getOptions().length) {
            this.accountSelection = selectValues.subRecords.getOptions()[0];
        } else {
            this.accountSelection = undefined;
        }
        this.accountSelectionChanged();
    }

    public accountSelectionChanged(): void {
        if (this.accountSelection === null) return;

        let series = {};
        let underlyings = {};
        let hIndex = {optionsIndex: 0, futuresIndex: 0};
        let vIndex: number = 0;
        let rows: ChartRow[] = [];
        let hTicks = [];
        let vTicks = [];
        let bubbles: PositionReportBubble[] = this.getLargestBubbles(this.accountSelection);
        for (let i = 0; i < bubbles.length; i++) {
            let hAxisKey: string = bubbles[i].symbol + '-' + bubbles[i].maturityMonthYear;
            let vAxisKey: string = bubbles[i].underlying;
            if (!(hAxisKey in series)) {
                if (bubbles[i].putCall && 0 !== bubbles[i].putCall.length) {
                    hIndex.optionsIndex++;
                    hTicks.push({v: hIndex.optionsIndex, f: hAxisKey});
                    series[hAxisKey] = hIndex.optionsIndex;
                } else {
                    hIndex.futuresIndex--;
                    hTicks.push({v: hIndex.futuresIndex, f: hAxisKey});
                    series[hAxisKey] = hIndex.futuresIndex;
                }
            }
            if (!(vAxisKey in underlyings)) {
                vTicks.push({v: vIndex, f: vAxisKey});
                underlyings[vAxisKey] = vIndex;
                vIndex++;
            }

            rows.push({
                c: [
                    {
                        v: bubbles[i].key
                    }, {
                        v: series[hAxisKey]
                    }, {
                        v: underlyings[vAxisKey]
                    }, {
                        v: bubbles[i].radius >= 0 ? compVarPositiveLegend : compVarNegativeLegend
                    }, {
                        v: Math.abs(bubbles[i].radius)
                    }
                ]
            });
        }

        this.title = '<strong>'
            + NUMBER_PIPE.transform(this.topRecordsCount, '.0-2')
            + '</strong> top risk positions represent <strong>'
            + NUMBER_PIPE.transform(this.positiveCoveragePerc, '.0-2')
            + '%</strong> of total portfolio VaR. <strong>'
            + NUMBER_PIPE.transform(this.topRecordsCount, '.0-2')
            + '</strong> top offsetting positions represent <strong>'
            + NUMBER_PIPE.transform(this.negativeCoveragePerc, '.0-2')
            + '%</strong> of total offsetting positions. Total portfolio VaR is <strong>'
            + NUMBER_PIPE.transform(this.totalCompVar, '.0-2') + '</strong>.';
        this.options.hAxis.ticks = hTicks;
        this.options.vAxis.ticks = vTicks;
        this.chartData = {
            cols: [{
                id: 'ID',
                type: 'string'
            }, {
                id: 'mmy',
                type: 'number'
            }, {
                id: 'underlying',
                type: 'number'
            }, {
                id: 'offset',
                type: 'string'
            }, {
                id: 'compVar',
                type: 'number'
            }],
            rows: rows
        };
    }

    // </editor-fold>

    //<editor-fold defaultstate="collapsed" desc="Chart data processing">

    public options: BubbleChartOptions = {
        explorer: {
            actions: ['dragToZoom', 'rightClickToReset']
        },
        legend: {
            position: 'right'
        },
        hAxis: {
            title: 'Series-Maturity',
            ticks: [],
            slantedText: true
        },
        vAxis: {
            title: 'Underlying',
            ticks: []
        },
        chartArea: {
            height: '50%'
        },
        backgroundColor: {
            fill: 'transparent'
        },
        bubble: {
            textStyle: {
                color: 'none'
            }
        },
        series: {
            [compVarPositiveLegend]: {
                color: 'red'
            },
            [compVarNegativeLegend]: {
                color: 'green'
            }
        },
        fontColor: 'black',
        sortBubblesBySize: true,
        titlePosition: 'none',
        titleTextStyle: {
            display: 'none'
        },
        title: 'no'
    };

    public chartData: ChartData;

    private bubblesMap: Map<string, PositionReportBubble> = new Map();

    private totalCompVar: number;

    private positiveCoveragePerc: number;

    private negativeCoveragePerc: number;

    private addRecordToBubbles(record: PositionReportChartData): void {
        let bubbleKey: string = record.clearer + '-' + record.member + '-' + record.account + '-' + record.symbol + '-' + record.maturityMonthYear;
        let radius: number = record.compVar;
        if (bubbleKey in this.bubblesMap.keys()) {
            this.bubblesMap.get(bubbleKey).radius += radius;
        } else {
            this.bubblesMap.set(bubbleKey, {
                key: bubbleKey,
                clearer: record.clearer,
                member: record.member,
                account: record.account,
                symbol: record.symbol,
                maturityMonthYear: record.maturityMonthYear,
                underlying: record.underlying,
                putCall: record.putCall,
                radius: radius
            });
        }
    }

    private getLargestBubbles(selection: PositionReportChartData): PositionReportBubble[] {
        let totalPositiveCompVar: number = 0;
        let topNPositiveCompVar: number = 0;
        let topNNegativeCompVar: number = 0;
        let totalNegativeCompVar: number = 0;
        let positiveBubbles: PositionReportBubble[] = [];
        let negativeBubbles: PositionReportBubble[] = [];
        this.bubblesMap.forEach((bubble: PositionReportBubble) => {
            if (bubble.clearer !== selection.clearer || bubble.member !== selection.member
                || bubble.account !== selection.account) {
                return;
            }
            if (bubble.radius >= 0) {
                positiveBubbles.push(bubble);
                totalPositiveCompVar += bubble.radius;
            } else {
                negativeBubbles.push(bubble);
                totalNegativeCompVar += Math.abs(bubble.radius);
            }
        });
        positiveBubbles = positiveBubbles.sort((a: PositionReportBubble, b: PositionReportBubble) => {
            return b.radius - a.radius;
        }).slice(1, this.topRecordsCount + 1);
        negativeBubbles = negativeBubbles.sort((a: PositionReportBubble, b: PositionReportBubble) => {
            return a.radius - b.radius;
        }).slice(1, this.topRecordsCount + 1);
        positiveBubbles.forEach((bubble: PositionReportBubble) => {
            topNPositiveCompVar += bubble.radius;
        });
        negativeBubbles.forEach((bubble: PositionReportBubble) => {
            topNNegativeCompVar += Math.abs(bubble.radius);
        });
        this.totalCompVar = totalPositiveCompVar - totalNegativeCompVar;
        if (totalPositiveCompVar > 0) {
            this.positiveCoveragePerc = (topNPositiveCompVar / this.totalCompVar) * 100;
        }
        if (totalNegativeCompVar > 0) {
            this.negativeCoveragePerc = (topNNegativeCompVar / totalNegativeCompVar) * 100;
        }
        let bubbles: PositionReportBubble[] = negativeBubbles.concat(positiveBubbles);
        bubbles.sort((a: PositionReportBubble, b: PositionReportBubble) => {
            let first = a.symbol + '-' + a.maturityMonthYear;
            let second = b.symbol + '-' + b.maturityMonthYear;
            if (first < second)
                return -1;
            if (first > second)
                return 1;
            return 0;
        });
        return bubbles;
    }

    // </editor-fold>
}