import {Input, Component} from '@angular/core';

import {Series, LineChartOptions, ChartData, ChartColumn, ChartRow, ChartValue} from './chart.types';
import {GoogleChart} from './google.chart.component';

@Component({
    moduleId: module.id,
    selector: 'google-line-chart',
    templateUrl: 'google.line.chart.component.html',
    styleUrls: ['google.chart.component.css']
})
export class GoogleLineChart extends GoogleChart {

    @Input()
    public showControls: boolean = false;

    @Input()
    public singleLineSelection: boolean = false;

    private hiddenColumns: number[] = [];

    constructor() {
        super();
    }

    @Input()
    public chartOptions: LineChartOptions;

    public getChartOptions(): LineChartOptions {
        let options: LineChartOptions = JSON.parse(JSON.stringify(this.chartOptions || {}));
        if (options.series && this.hiddenColumns) {
            options.series = options.series
                .filter((val: Series, index: number) => {
                    return this.hiddenColumns.indexOf(index + 1) === -1;
                });
        }
        return options;
    }

    public getChartData(): google.visualization.DataTable {
        // let chartData: google.visualization.DataView = new google.visualization.DataView(
        //     new google.visualization.DataTable(this.convertToChartData()));
        // chartData.hideColumns(this.hiddenColumns);
        // TODO: https://github.com/google/google-visualization-issues/issues/2406
        // Method above does not work with animations...once fixed replace the manual change with data view.
        let chartData: ChartData = {};
        let convertedChartData = this.convertToChartData();

        chartData.cols = convertedChartData.cols.filter((column: ChartColumn, index: number) => {
            return this.hiddenColumns.indexOf(index) === -1;
        });
        chartData.rows = [];
        convertedChartData.rows.forEach((row: ChartRow) => {
            chartData.rows.push({
                c: row.c.filter((rowData: ChartValue, index: number) => {
                    return this.hiddenColumns.indexOf(index) === -1;
                }),
                originalData: row.originalData
            });

        });
        // TODO: END of the block above

        return new google.visualization.DataTable(chartData);
    }

    private convertToChartData() {
        let originalChartData: ChartData | google.visualization.DataTable | google.visualization.DataView = super.getChartData();
        let convertedChartData: ChartData;
        if (originalChartData instanceof google.visualization.DataView) {
            convertedChartData = <ChartData>JSON.parse((<google.visualization.DataView>originalChartData).toDataTable().toJSON());
        } else if (originalChartData instanceof google.visualization.DataTable) {
            convertedChartData = <ChartData>JSON.parse((<google.visualization.DataTable>originalChartData).toJSON());
        } else {
            convertedChartData = <ChartData>originalChartData;
        }
        return convertedChartData;
    }

    public get chartType(): string {
        return 'LineChart';
    }

    public set chartType(type: string) {
        throw new Error('Chart type for google-line-chart is fixed to \'LineChart\' and can\'t be changed!');
    }

    public hideColumn(index: number): void {
        if (this.singleLineSelection) {
            this.hiddenColumns = [];
            if (index !== -1) {
                for (let i = 1; i < this.convertToChartData().cols.length; i++) {
                    if (i !== index) {
                        this.hiddenColumns.push(i);
                    }
                }
            }
        } else {
            let indexOf = this.hiddenColumns.indexOf(index);
            if (indexOf === -1) {
                if (this.hiddenColumns.length === this.convertToChartData().cols.length - 2) {
                    return;
                }
                this.hiddenColumns.push(index);
            } else {
                this.hiddenColumns.splice(indexOf, 1);
            }
        }

        if (this.wrapper) {
            this.wrapper.getChart().draw(this.getChartData(), this.getChartOptions());
        }
    }
}

