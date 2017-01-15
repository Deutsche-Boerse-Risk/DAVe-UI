import {
    Input, Component, OnChanges, HostBinding, OnInit, OnDestroy, SimpleChanges, Output, EventEmitter
} from '@angular/core';

import {ChartOptions, ChartData, SelectionEvent} from './chart.types';

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

    @Input()
    public id: string;

    @Input()
    public chartType: string;

    @Input()
    public chartOptions: ChartOptions;

    @Input()
    public chartData: ChartData;

    @Output()
    public selected: EventEmitter<SelectionEvent> = new EventEmitter();

    @Input()
    @HostBinding('style.height')
    public height: any;

    private initialized: boolean = false;

    private wrapper: any;

    private _selectionHandle: any;

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
            google.visualization.events.removeListener(this._selectionHandle);
            this.wrapper.clear();
        }
    }

    private reinitChart(): void {
        if (!googleLoaded) {
            googleLoaded = true;
            google.charts.load('current', {'packages': ['corechart', 'gauge']});
        }
        setTimeout(() => {
            this.drawGraph(this.chartOptions, this.chartType, this.chartData, this.id)
        }, 0);
    }

    private drawGraph(chartOptions: ChartOptions, chartType: string, chartData: ChartData, id: string): void {
        google.charts.setOnLoadCallback(() => {
            this.ngOnDestroy();

            this.wrapper = new google.visualization.ChartWrapper({
                chartType: chartType,
                dataTable: chartData,
                options: chartOptions || {},
                containerId: id
            });
            this.wrapper.draw();

            this._selectionHandle = google.visualization.events.addListener(this.wrapper, 'select',
                () => {
                    this.selected.emit(this.wrapper.getChart().getSelection());
                });
        });
    }
}

