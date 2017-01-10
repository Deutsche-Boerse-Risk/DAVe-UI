import {AbstractListComponent} from './abstract.list.component';

import {ChartData, ChartColumn, ChartRow, LineChartOptions} from './common/chart.types';

import {DATE_PIPE, NUMBER_PIPE} from './common/common.module';

export interface LineChartColumn extends ChartColumn {
    value: any;
}

export abstract class AbstractHistoryListComponent<T> extends AbstractListComponent<T> {

    protected rawChartData: LineChartColumn[][];

    public chartData: ChartData;

    public chartOptions: LineChartOptions = {
        vAxis: {
            textStyle: {
                color: 'gray',
                fontSize: 12
            }
        },
        hAxis: {
            textStyle: {
                color: 'gray',
                fontSize: 12
            },
            gridlines: {
                count: -1,
                units: {
                    hours: {format: ['HH:mm', ':mm']},
                }
            },
            minorGridlines: {
                units: {
                    hours: {format: ['HH:mm', ':mm']},
                    minutes: {format: ['HH:mm', ':mm']}
                }
            }
        },
        explorer: {
            actions: ['dragToZoom', 'rightClickToReset']
        },
        chartArea: {
            top: '2%',
            height: '88%',
            left: '5%',
            width: '92%'
        },
        curveType: 'function',
        legend: {position: 'none'},
        pointShape: 'circle',
        focusTarget: 'category',
        pointSize: 5,
        series: {
            0: {
                color: '#31C0BE'
            },
            1: {
                color: '#c7254e'
            },
            2: {
                color: '#800000'
            },
            3: {
                color: '#808000'
            },
            4: {
                color: '#FF00FF'
            },
            5: {
                color: '#006fff'
            }
        }
    };

    protected processData(data: T[]): void {
        super.processData(data);

        let chartData: LineChartColumn[][] = [];

        for (let index = 0; index < data.length; ++index) {
            chartData.push(this.getTickFromRecord(data[index]));
        }
        chartData.sort((tick1: LineChartColumn[], tick2: LineChartColumn[]) => {
            if (tick1[0].value < tick2[0].value)
                return -1;
            if (tick1[0].value > tick2[0].value)
                return 1;
            return 0;
        });
        this.rawChartData = chartData;
        this.chartData = this.prepareChartData();
    }

    protected abstract getTickFromRecord(record: T): LineChartColumn[];

    protected prepareChartData(): ChartData {
        if (!this.rawChartData || !this.rawChartData.length) {
            return;
        }

        let i = 0;
        this.rawChartData[0].forEach((value: LineChartColumn) => {
            value.id = i++ + ''
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
                            f: DATE_PIPE.transform(column.value, 'yyyy-MM-dd HH:mm:ss')
                        }
                    }
                    if (column.type === 'number') {
                        return {
                            v: column.value,
                            f: NUMBER_PIPE.transform(column.value, '.2-2')
                        }
                    }
                    return {
                        v: column.value
                    }
                })
            };
        });
        return chartData;
    }
}