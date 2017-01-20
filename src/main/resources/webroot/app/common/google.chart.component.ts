import {Input, Component, OnChanges, OnInit, OnDestroy, SimpleChanges, Output, EventEmitter} from '@angular/core';

import {ChartData, SelectionEvent, CommonChartOptions} from './chart.types';

declare let googleLoaded: any;

@Component({
    moduleId: module.id,
    selector: 'google-chart',
    template: '<div [id]="id" [style.height]="height"></div>',
    styleUrls: ['google.chart.component.css']
})
export class GoogleChart implements OnInit, OnChanges, OnDestroy {

    @Input()
    public chartType: string;

    @Input()
    public chartOptions: CommonChartOptions;

    @Input()
    public chartData: ChartData;

    @Output()
    public selected: EventEmitter<SelectionEvent> = new EventEmitter();

    @Input()
    public height: any;

    private initialized: boolean = false;

    protected wrapper: google.visualization.ChartWrapper;

    protected _selectionHandle: google.visualization.events.EventListenerHandle;

    private _uid: string = this.generateUID();

    private _resizeHandle: () => any;

    public get id(): string {
        return this._uid;
    }

    constructor() {
        this._resizeHandle = () => {
            this.reinitializeChart();
        };
    }

    public ngOnInit(): void {
        this.initialized = true;
        this.reinitializeChart();
        window.addEventListener("resize", this._resizeHandle, false);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.initialized) {
            this.reinitializeChart();
        }
    }

    public ngOnDestroy(): void {
        this.destroyChart();
        window.removeEventListener("resize", this._resizeHandle, false);
    }

    protected destroyChart(): void {
        if (this.wrapper) {
            google.visualization.events.removeListener(this._selectionHandle);
            this.wrapper.clear();
        }
    }

    private reinitializeChart(): void {
        if (!googleLoaded) {
            googleLoaded = true;
            google.charts.load('current', {'packages': ['corechart', 'gauge']});
        }
        setTimeout(() => {
            this.drawGraph();
        }, 0);
    }

    protected drawGraph(): void {
        google.charts.setOnLoadCallback(() => {
            this.destroyChart();

            this.wrapper = new google.visualization.ChartWrapper({
                chartType: this.chartType,
                dataTable: this.chartData,
                options: this.chartOptions,
                containerId: this.id
            });
            this.wrapper.draw();

            this._selectionHandle = google.visualization.events.addListener(this.wrapper, 'select',
                () => {
                    this.selected.emit(this.wrapper.getChart().getSelection());
                });
        });
    }

    private generateUID(): string {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}

