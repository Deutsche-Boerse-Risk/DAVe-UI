import {Component} from '@angular/core';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';

import {ErrorResponse} from '../http.service';

import {NUMBER_PIPE} from '../common/common.module';
import {BubbleChartOptions, ChartData, ChartRow, ChartValue} from '../common/chart.types';

import {PositionReportsService} from './position.reports.service';
import {PositionReportChartData, PositionReportBubble, SelectValues} from './position.report.types';

const compVarPositiveLegend = 'Positive';
const compVarNegativeLegend = 'Negative';

@Component({
    moduleId: module.id,
    selector: 'position-report-bubblechart',
    templateUrl: 'position.report.bubblechart.component.html',
    styleUrls: ['../common.component.css']
})
export class PositionReportBubbleChartComponent extends AbstractComponentWithAutoRefresh {

    public errorMessage: string;

    public initialLoad: boolean = true;

    public title: string;

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
        sortBubblesBySize: true,
        titlePosition: 'none',
        titleTextStyle: {
            display: 'none'
        },
        title: 'no'
    };

    public chartData: ChartData;

    public sourceData: PositionReportChartData;

    constructor(private positionReportsService: PositionReportsService) {
        super();
    }

    protected loadData(): void {
        this.positionReportsService.getPositionReportsChartData()
            .subscribe(
                this.processData.bind(this),
                (err: ErrorResponse) => {
                    this.errorMessage = 'Server returned status ' + err.status;
                    this.initialLoad = false;
                });
    }

    private processData(chartData: PositionReportChartData): void {
        this.sourceData = chartData;
        this.accountSelectionChanged();

        delete this.errorMessage;
        this.initialLoad = false;
    }

    //<editor-fold defaultstate="collapsed" desc="Member/Account/Bubbles count selection">

    public topRecords: number[] = [10, 20, 30];

    public topRecordsCount: number = 20;

    public memberSelectionChanged(): void {
        let selectValues: SelectValues = this.sourceData.selection.get(this.sourceData.memberSelection.memberKey);
        if (selectValues.subRecords.getOptions().length) {
            this.sourceData.accountSelection = selectValues.subRecords.getOptions()[0];
        } else {
            delete this.sourceData.accountSelection;
        }
        this.accountSelectionChanged();
    }

    public accountSelectionChanged(): void {
        if (!this.sourceData.accountSelection) {
            return;
        }

        this.prepareChartData();
    }

    // </editor-fold>

    //<editor-fold defaultstate="collapsed" desc="Chart data processing">

    private getLargestBubbles(): PositionReportBubble[] {
        let totalPositiveCompVar: number = 0;
        let topNPositiveCompVar: number = 0;
        let topNNegativeCompVar: number = 0;
        let totalNegativeCompVar: number = 0;
        let totalCompVar: number;
        let positiveCoveragePerc: number;
        let negativeCoveragePerc: number;
        let positiveBubbles: PositionReportBubble[] = [];
        let negativeBubbles: PositionReportBubble[] = [];
        this.sourceData.bubbles.forEach((bubble: PositionReportBubble) => {
            if (bubble.clearer !== this.sourceData.accountSelection.clearer
                || bubble.member !== this.sourceData.accountSelection.member
                || bubble.account !== this.sourceData.accountSelection.account) {
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
        totalCompVar = totalPositiveCompVar - totalNegativeCompVar;
        if (totalPositiveCompVar > 0) {
            positiveCoveragePerc = (topNPositiveCompVar / totalCompVar) * 100;
        }
        if (totalNegativeCompVar > 0) {
            negativeCoveragePerc = (topNNegativeCompVar / totalNegativeCompVar) * 100;
        }
        let bubbles: PositionReportBubble[] = negativeBubbles.concat(positiveBubbles);
        bubbles.sort((a: PositionReportBubble, b: PositionReportBubble) => {
            let first = a.hAxisKey;
            let second = b.hAxisKey;
            if (first < second)
                return -1;
            if (first > second)
                return 1;
            return 0;
        });

        this.title = '<strong>'
            + NUMBER_PIPE.transform(this.topRecordsCount, '.0-0')
            + '</strong> top risk positions represent <strong>'
            + NUMBER_PIPE.transform(positiveCoveragePerc, '.2-2')
            + '%</strong> of total portfolio VaR. <strong>'
            + NUMBER_PIPE.transform(this.topRecordsCount, '.0-0')
            + '</strong> top offsetting positions represent <strong>'
            + NUMBER_PIPE.transform(negativeCoveragePerc, '.2-2')
            + '%</strong> of total offsetting positions. Total portfolio VaR is <strong>'
            + NUMBER_PIPE.transform(totalCompVar, '.2-2') + '</strong>.';

        return bubbles;
    }

    private prepareChartData() {
        let series: any = {};
        let underlyings: any = {};
        let hIndex = {optionsIndex: 0, futuresIndex: 0};
        let vIndex: number = 0;
        let rows: ChartRow[] = [];
        let hTicks: ChartValue[] = [];
        let vTicks: ChartValue[] = [];
        let bubbles: PositionReportBubble[] = this.getLargestBubbles();
        for (let i = 0; i < bubbles.length; i++) {
            let hAxisKey: string = bubbles[i].hAxisKey;
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
                        v: bubbles[i].key,
                        f: ''
                    },
                    {
                        v: series[hAxisKey],
                        f: hAxisKey
                    },
                    {
                        v: underlyings[vAxisKey],
                        f: vAxisKey
                    },
                    {
                        v: bubbles[i].radius >= 0 ? compVarPositiveLegend : compVarNegativeLegend
                    },
                    {
                        v: Math.abs(bubbles[i].radius),
                        f: NUMBER_PIPE.transform(bubbles[i].radius, '.2-2')
                    }
                ]
            });
        }
        this.options.hAxis.ticks = hTicks;
        this.options.vAxis.ticks = vTicks;
        this.chartData = {
            cols: [{
                id: 'ID',
                type: 'string'
            }, {
                id: 'mmy',
                type: 'number',
                label: 'Series-Maturity'
            }, {
                id: 'underlying',
                type: 'number',
                label: 'Underlying'
            }, {
                id: 'offset',
                type: 'string',
                label: 'Contributing'
            }, {
                id: 'compVar',
                type: 'number',
                label: 'Value at risk'
            }],
            rows: rows
        };
    }

    // </editor-fold>

    public trackByIndex(index: number): number {
        return index;
    }

    public trackByKey(index: number, bubble: PositionReportBubble): string {
        return bubble.key;
    }
}