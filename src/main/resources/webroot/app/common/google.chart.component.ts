import {ElementRef, Input, Component, OnChanges, HostBinding, OnInit, OnDestroy, SimpleChanges} from '@angular/core';

import {ChartOptions, ChartData} from './chart.types';

declare let google: any;
declare let googleLoaded: any;

@Component({
    moduleId: module.id,
    selector: 'google-chart',
    template: '<div [id]="id"></div>',
    styles: ['/deep/ google-chart > div { width: 100%; height: 100%; }'],
    styleUrls: ['../common.component.css']
})
export class GoogleChart implements OnInit, OnChanges, OnDestroy {

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

    private initialized: boolean = false;

    private wrapper: any;

    constructor(public element: ElementRef) {
        this._element = this.element.nativeElement;
    }

    public ngOnInit(): void {
        this.initialized = true;
        this.reinitChart();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.initialized) {
            this.reinitChart();
        }
    }

    public ngOnDestroy(): void {
        if (this.wrapper) {
            this.wrapper.clear();
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
        google.charts.setOnLoadCallback(() => {
            this.ngOnDestroy();

            this.wrapper = new google.visualization.ChartWrapper({
                chartType: chartType,
                dataTable: chartData,
                options: chartOptions || {},
                containerId: ele.id
            });
            this.wrapper.draw();
        });
    }
}

