import {ElementRef, Input, Component, OnChanges, SimpleChanges} from '@angular/core';

import {ChartOptions, ChartData} from "./chart.types";

declare var google: any;
declare var googleLoaded: any;
@Component({
    moduleId: module.id,
    selector: 'google-chart]',
    template: '<div [id]="id" [style.height]="height"></div>',
    styles: ['div { width: 100% !important }'],
    styleUrls: ['common.component.css']
})
export class GoogleChart implements OnChanges {

    public _element: HTMLElement;

    @Input()
    public id: string;

    @Input()
    public chartType: string;

    @Input()
    public chartOptions: ChartOptions;

    @Input()
    public chartData: ChartData;

    @Input()
    public height: any;

    constructor(public element: ElementRef) {
        this._element = this.element.nativeElement;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.reinitChart();
    }

    private reinitChart(): void {
        if (!googleLoaded) {
            googleLoaded = true;
            google.charts.load('current', {'packages': ['corechart', 'gauge']});
        }
        this.drawGraph(this.chartOptions, this.chartType, this.chartData, this._element);
    }

    private drawGraph(chartOptions: ChartOptions, chartType, chartData: ChartData, ele) {
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            let wrapper = new google.visualization.ChartWrapper({
                chartType: chartType,
                dataTable: chartData,
                options: chartOptions || {},
                containerId: ele.id
            });
            wrapper.draw();
        }
    }
}

