import {Component, Input, EventEmitter, Output} from '@angular/core';

import {CommonChartOptions, ChartData, SelectionEvent, LineChartOptions} from '../../app/charts/chart.types';

@Component({
    moduleId: module.id,
    selector: 'google-chart',
    template: ''
})
export class GoogleChartStub {

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
}


@Component({
    moduleId: module.id,
    selector: 'google-line-chart',
    template: ''
})
export class GoogleLineChartStub {
    @Input()
    public showControls: boolean = false;

    @Input()
    public singleLineSelection: boolean = false;

    @Input()
    public height: any;

    @Input()
    public chartOptions: LineChartOptions;

    @Input()
    public chartData: ChartData | google.visualization.DataTable | google.visualization.DataView;
}