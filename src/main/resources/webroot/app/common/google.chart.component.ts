import {ElementRef, Input, Component, OnChanges, SimpleChanges, HostBinding, OnInit} from '@angular/core';

import {ChartOptions, ChartData} from "./chart.types";

declare var google: any;
declare var googleLoaded: any;
@Component({
    moduleId: module.id,
    selector: 'google-chart]',
    template: '<div [id]="id"></div>',
    styles: ['/deep/ google-chart > div { width: 100%; height: 100%; }'],
    styleUrls: ['common.component.css']
})
export class GoogleChart implements OnInit, OnChanges {

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
    @HostBinding('style.height')
    public height: any;

    private intialized: boolean = false;

    constructor(public element: ElementRef) {
        this._element = this.element.nativeElement;
    }

    public ngOnInit(): void {
        this.intialized = true;
        this.reinitChart();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.intialized) {
            this.reinitChart();
        }
    }

    private reinitChart(): void {
        if (!googleLoaded) {
            googleLoaded = true;
            google.charts.load('current', {'packages': ['corechart', 'gauge']});
        }
        setTimeout(() => {
            this.drawGraph(this.chartOptions, this.chartType, this.chartData, this._element)
        }, 0);
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

