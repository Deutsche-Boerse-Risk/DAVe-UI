import {Input, Component} from '@angular/core';

import {Series, LineChartOptions} from './chart.types';
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
    public chartOptions: LineChartOptions;

    public _hiddenColumns: number[] = [];

    constructor() {
        super();
    }

    public hideColumn(index: number): void {
        let indexOf = this._hiddenColumns.indexOf(index);
        if (indexOf === -1) {
            if (this._hiddenColumns.length === this.chartData.cols.length - 2) {
                return;
            }
            this._hiddenColumns.push(index);
        } else {
            this._hiddenColumns.splice(indexOf, 1);
        }

        if (this.wrapper) {
            this.wrapper.getChart().draw(this.createDataView(), this.getChartOptions());
        }
    }

    protected drawGraph(): void {
        google.charts.setOnLoadCallback(() => {
            this.destroyChart();

            this.wrapper = new google.visualization.ChartWrapper({
                chartType: "LineChart",
                dataTable: this.createDataView(),
                options: this.getChartOptions(),
                containerId: this.id
            });
            this.wrapper.draw();

            this._selectionHandle = google.visualization.events.addListener(this.wrapper, 'select',
                () => {
                    this.selected.emit(this.wrapper.getChart().getSelection());
                });
        });
    }

    private getChartOptions(): LineChartOptions {
        let options: LineChartOptions = JSON.parse(JSON.stringify(this.chartOptions || {}));
        if (options.series) {
            options.series = options.series
                .filter((val: Series, index: number) => {
                    return this._hiddenColumns.indexOf(index + 1) === -1;
                });
        }
        return options;
    }

    private createDataView(): google.visualization.DataView {
        let view = new google.visualization.DataView(new google.visualization.DataTable(this.chartData));
        view.hideColumns(this._hiddenColumns);
        return view;
    }
}

