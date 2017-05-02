import {
    Input, Component, OnChanges, OnInit, OnDestroy, SimpleChanges, Output, EventEmitter,
    ElementRef, ViewChild
} from '@angular/core';

import {ChartData, SelectionEvent, CommonChartOptions, loadGoogleCharts} from './chart.types';

import {UIDUtils} from '../uid.utils';

@Component({
    moduleId : module.id,
    selector : 'google-chart',
    template : '<div #chartDiv [id]="id" [style.height]="height"></div>',
    styleUrls: [
        '../component.css',
        'google.chart.component.css'
    ]
})
export class GoogleChart implements OnInit, OnChanges, OnDestroy {

    @Input()
    public chartType: string;

    @Input()
    public chartOptions: CommonChartOptions;

    @Input()
    public chartData: ChartData | google.visualization.DataTable | google.visualization.DataView;

    @Output()
    public selected: EventEmitter<SelectionEvent> = new EventEmitter();

    @Input()
    public height: any;

    @ViewChild('chartDiv')
    public chartElement: ElementRef;

    private initialized: boolean = false;

    protected wrapper: google.visualization.ChartWrapper;

    protected _selectionHandle: google.visualization.events.EventListenerHandle;

    private _uid: string = UIDUtils.generateUID();

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
        window.addEventListener('resize', this._resizeHandle, false);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.initialized) {
            this.reinitializeChart();
        }
    }

    public ngOnDestroy(): void {
        if (this.wrapper) {
            google.visualization.events.removeListener(this._selectionHandle);
            this.wrapper.clear();
        }
        window.removeEventListener('resize', this._resizeHandle, false);
    }

    private reinitializeChart(): void {
        loadGoogleCharts(() =>
            setTimeout(() => this.drawGraph(), 0));
    }

    private drawGraph(): void {
        if (!this.chartData || !this.chartOptions || !this.chartType) {
            return;
        }
        if (this.wrapper) {
            this.wrapper.getChart().draw(GoogleChart.prepareDataTableOrDataView(this.chartData), this.chartOptions);
        } else {
            this.wrapper = new google.visualization.ChartWrapper({
                chartType  : this.chartType,
                dataTable  : this.chartData,
                options    : this.chartOptions,
                containerId: this.chartElement.nativeElement.id
            });
            this.wrapper.draw(this.chartElement.nativeElement);

            this._selectionHandle = google.visualization.events.addListener(this.wrapper, 'select',
                () => {
                    this.selected.emit(
                        this.wrapper.getChart()
                            .getSelection());
                });
        }
    }

    public static prepareDataTableOrDataView(originalChartData: ChartData
        | google.visualization.DataTable | google.visualization.DataView): google.visualization.DataTable
        | google.visualization.DataView {
        if (originalChartData instanceof google.visualization.DataView) {
            return <google.visualization.DataView>originalChartData;
        }
        if (originalChartData instanceof google.visualization.DataTable) {
            return <google.visualization.DataTable>originalChartData;
        }
        return new google.visualization.DataTable(<ChartData>originalChartData);
    }
}

