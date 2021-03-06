import {DecimalPipe} from '@angular/common';
import {Component, Input} from '@angular/core';

import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-devkit';
import {BubbleChartOptions, ChartData, ChartRow, ChartValue} from '@dbg-riskit/dave-ui-charts';
import {PercentPipe} from '@dbg-riskit/dave-ui-view';

import {AbstractComponent} from '../abstract.component';

import {PositionReportsService} from './position.reports.service';
import {PositionReportBubble, PositionReportChartData, SelectValues} from './position.report.types';
import {Subscription} from 'rxjs/Subscription';

export const compVarPositiveLegend = 'Positive';
export const compVarNegativeLegend = 'Negative';

@Component({
    moduleId   : module.id,
    templateUrl: 'position.report.bubblechart.component.html',
    styleUrls  : [
        '../../' + COMPONENT_CSS,
        'position.report.bubblechart.component.css'
    ]
})
export class PositionReportBubbleChartComponent extends AbstractComponent {

    public initialLoad: boolean = true;

    public title: string;

    @Input()
    public chartShown: boolean = true;

    public options: BubbleChartOptions = {
        explorer         : {
            actions: ['dragToZoom', 'rightClickToReset']
        },
        legend           : {
            position: 'right'
        },
        hAxis            : {
            title      : 'Series-Maturity',
            ticks      : [],
            slantedText: true
        },
        vAxis            : {
            title: 'Underlying',
            ticks: []
        },
        chartArea        : {
            height: '50%'
        },
        backgroundColor  : {
            fill: 'white'
        },
        bubble           : {
            textStyle: {
                color: 'none'
            }
        },
        series           : {
            [compVarPositiveLegend]: {
                color: '#CC3333'
            },
            [compVarNegativeLegend]: {
                color: '#66CC33'
            }
        },
        sortBubblesBySize: true,
        titlePosition    : 'none',
        titleTextStyle   : {
            display: 'none'
        },
        title            : 'no'
    };

    public chartData: ChartData;

    public sourceData: PositionReportChartData;

    constructor(private positionReportsService: PositionReportsService, private numberPipe: DecimalPipe,
        private percentPipe: PercentPipe) {
        super();
    }

    protected loadData(): Subscription {
        return this.positionReportsService.getPositionReportsChartData()
            .subscribe(this.processData.bind(this));
    }

    private processData(chartData: PositionReportChartData): void {
        // Clone safe so we do not lost the current selection on periodic reload of data.
        if (this.sourceData) {
            this.sourceData.bubbles = chartData.bubbles;
            this.sourceData.selection = chartData.selection;
            if (!this.sourceData.memberSelection || !this.memberSelectionOptions
                    .some((option: PositionReportBubble) => {
                        return option.memberKey === this.sourceData.memberSelection.memberKey;
                    })) {
                this.sourceData.memberSelection = chartData.memberSelection;
            }

            if (this.sourceData.memberSelection) {
                let options = this.accountSelectionOptions;
                if (!this.sourceData.accountSelection || !options
                        .some((option: PositionReportBubble) => {
                            return option.memberKey === this.sourceData.accountSelection.memberKey
                                && option.account === this.sourceData.accountSelection.account;
                        })) {
                    this.sourceData.accountSelection = options[0];
                }
            } else {
                delete this.sourceData.accountSelection;
            }
        } else {
            this.sourceData = chartData;
        }
        this.accountSelectionChanged();

        this.initialLoad = false;
    }

    //<editor-fold defaultstate="collapsed" desc="Member/Account/Bubbles count selection">

    public topRecords: number[] = [10, 20, 30];

    public topRecordsCount: number = 20;

    public get memberSelectionOptions(): PositionReportBubble[] {
        return this.sourceData.selection.getOptions();
    }

    public memberSelectionChanged(): void {
        let options = this.accountSelectionOptions;
        if (options.length) {
            this.sourceData.accountSelection = options[0];
        } else {
            delete this.sourceData.accountSelection;
        }
        this.accountSelectionChanged();
    }

    public get accountSelectionOptions(): PositionReportBubble[] {
        if (this.sourceData.memberSelection) {
            let selectValues: SelectValues = this.sourceData.selection.get(this.sourceData.memberSelection.memberKey);
            return selectValues.subRecords.getOptions();
        }
        return [];
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
        let positiveCoveragePerc: number = 0;
        let negativeCoveragePerc: number = 0;
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
        }).slice(0, this.topRecordsCount);
        negativeBubbles = negativeBubbles.sort((a: PositionReportBubble, b: PositionReportBubble) => {
            return a.radius - b.radius;
        }).slice(0, this.topRecordsCount);
        positiveBubbles.forEach((bubble: PositionReportBubble) => {
            topNPositiveCompVar += bubble.radius;
        });
        negativeBubbles.forEach((bubble: PositionReportBubble) => {
            topNNegativeCompVar += Math.abs(bubble.radius);
        });
        totalCompVar = totalPositiveCompVar - totalNegativeCompVar;
        if (totalPositiveCompVar > 0) {
            positiveCoveragePerc = (topNPositiveCompVar / (totalCompVar || 1)) * 100;
        }
        if (totalNegativeCompVar > 0) {
            negativeCoveragePerc = (topNNegativeCompVar / (totalNegativeCompVar || 1)) * 100;
        }
        let bubbles: PositionReportBubble[] = negativeBubbles.concat(positiveBubbles);
        bubbles.sort((a: PositionReportBubble, b: PositionReportBubble) => {
            let first = a.hAxisKey;
            let second = b.hAxisKey;
            if (first < second) {
                return -1;
            }
            if (first > second) {
                return 1;
            }
            return 0;
        });

        this.title = `
            <strong>
                ${this.numberPipe.transform(Math.min(this.topRecordsCount, positiveBubbles.length), '.0-0')}
            </strong>
            top risk positions represent 
            <strong>    
                ${this.percentPipe.transform(positiveCoveragePerc, '.2-2')}
            </strong>
            of total portfolio VaR.
            <strong>
                ${this.numberPipe.transform(Math.min(this.topRecordsCount, negativeBubbles.length), '.0-0')}
            </strong>
            top offsetting positions represent
            <strong>
                ${this.percentPipe.transform(negativeCoveragePerc, '.2-2')}
            </strong>
            of total offsetting positions. Total portfolio VaR is
            <strong>
                ${this.numberPipe.transform(totalCompVar, '.0-0')} ${this.sourceData.clearingCurrency}.
            </strong>`;

        return bubbles;
    }

    private prepareChartData() {
        let series: any = {};
        let underlyings: any = {};
        let hIndex = {
            optionsIndex: 0,
            futuresIndex: 0
        };
        let vIndex: number = 0;
        let rows: ChartRow[] = [];
        let hTicks: ChartValue[] = [];
        let vTicks: ChartValue[] = [];
        let bubbles: PositionReportBubble[] = this.getLargestBubbles();
        for (let i = 0; i < bubbles.length; i++) {
            let hAxisKey: string = bubbles[i].hAxisKey;
            let vAxisKey: string = bubbles[i].underlying;
            if (!(hAxisKey in series)) {
                if (bubbles[i].putCall && bubbles[i].putCall.length !== 0) {
                    hIndex.optionsIndex++;
                    hTicks.push({
                        v: hIndex.optionsIndex,
                        f: hAxisKey
                    });
                    series[hAxisKey] = hIndex.optionsIndex;
                } else {
                    hIndex.futuresIndex--;
                    hTicks.push({
                        v: hIndex.futuresIndex,
                        f: hAxisKey
                    });
                    series[hAxisKey] = hIndex.futuresIndex;
                }
            }
            if (!(vAxisKey in underlyings)) {
                vTicks.push({
                    v: vIndex,
                    f: vAxisKey
                });
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
                        f: this.numberPipe.transform(bubbles[i].radius, '.0-0') + ' ' + this.sourceData.clearingCurrency
                    }
                ]
            });
        }
        this.options.hAxis.ticks = hTicks;
        this.options.vAxis.ticks = vTicks;
        this.chartData = {
            cols: [
                {
                    id  : 'ID',
                    type: 'string'
                }, {
                    id   : 'mmy',
                    type : 'number',
                    label: 'Series-Maturity'
                }, {
                    id   : 'underlying',
                    type : 'number',
                    label: 'Underlying'
                }, {
                    id   : 'offset',
                    type : 'string',
                    label: 'Contributing'
                }, {
                    id   : 'compVar',
                    type : 'number',
                    label: 'Value at risk'
                }
            ],
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