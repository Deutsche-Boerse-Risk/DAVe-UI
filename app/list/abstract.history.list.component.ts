import {DecimalPipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

import {ChartColumn, ChartData, LineChartOptions} from '@dbg-riskit/dave-ui-charts';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {AbstractListComponent} from './abstract.list.component';

export interface LineChartColumn extends ChartColumn {
    value: any;
    ccy?: string;
    prec?: string;
}

export abstract class AbstractHistoryListComponent<T extends { uid: string }> extends AbstractListComponent<T> {

    protected rawChartData: LineChartColumn[][];

    public chartData: ChartData;

    public chartOptions: LineChartOptions = {
        animation  : {
            startup : true,
            duration: 300,
            easing  : 'inAndOut'
        },
        vAxis      : {
            textStyle: {
                color   : 'gray',
                fontSize: 12
            }
        },
        hAxis      : {
            textStyle     : {
                color   : 'gray',
                fontSize: 12
            },
            gridlines     : {
                count: -1,
                units: {
                    hours: {format: ['HH:mm', ':mm']}
                }
            },
            minorGridlines: {
                units: {
                    hours  : {format: ['HH:mm', ':mm']},
                    minutes: {format: ['HH:mm', ':mm']}
                }
            }
        },
        chartArea  : {
            top   : 4,
            bottom: 16,
            height: '100%',
            left  : 150,
            right : 40,
            width : '100%'
        },
        legend     : {position: 'none'},
        pointShape : 'circle',
        focusTarget: 'category',
        pointSize  : 5,
        series     : [
            {
                color: '#000099'
            },
            {
                color: '#4B9BFF'
            },
            {
                color: '#7DCDFF'
            },
            {
                color: '#B4E1FF'
            },
            {
                color: '#D7EBFF'
            },
            {
                color: '#D2D2D2'
            },
            {
                color: '#AFAFAF'
            },
            {
                color: '#919191'
            },
            {
                color: '#6E6E6E'
            },
            {
                color: '#000000'
            },
            {
                color: '#3B3EAC'
            },
            {
                color: '#0099C6'
            },
            {
                color: '#DD4477'
            },
            {
                color: '#66AA00'
            },
            {
                color: '#B82E2E'
            }
        ]
    };

    constructor(route: ActivatedRoute, private dateFormatter: DateFormatter, private numberPipe: DecimalPipe) {
        super(route);
    }

    protected processData(data: T[]): void {
        super.processData(data);

        let chartData: LineChartColumn[][] = [];

        for (let index = 0; index < data.length; ++index) {
            chartData.push(this.getTickFromRecord(data[index]));
        }
        chartData.sort((tick1: LineChartColumn[], tick2: LineChartColumn[]) => {
            if (tick1[0].value < tick2[0].value) {
                return -1;
            }
            if (tick1[0].value > tick2[0].value) {
                return 1;
            }
            return 0;
        });

        delete this.rawChartData;
        this.rawChartData = chartData;
        delete this.chartData;
        this.chartData = this.prepareChartData();
    }

    protected abstract getTickFromRecord(record: T): LineChartColumn[];

    protected prepareChartData(): ChartData {
        if (!this.rawChartData || !this.rawChartData.length) {
            return null;
        }

        let i = 0;
        this.rawChartData[0].forEach((value: LineChartColumn) => {
            value.id = (i++) + '';
        });

        let chartData: ChartData = {
            cols: this.rawChartData[0],
            rows: []
        };

        chartData.rows = this.rawChartData.map((rowArray: LineChartColumn[]) => {
            return {
                c: rowArray.map((column: LineChartColumn) => {
                    if (column.type === 'date') {
                        return {
                            v: column.value,
                            f: this.dateFormatter.transform(column.value)
                        };
                    }
                    if (column.type === 'number') {
                        return {
                            v: column.value,
                            f: this.numberPipe.transform(column.value, column.prec || '.0-0') + (column.ccy ?
                                ' ' + column.ccy : '')
                        };
                    }
                    return {
                        v: column.value
                    };
                })
            };
        });
        return chartData;
    }
}