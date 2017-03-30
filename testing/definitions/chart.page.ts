import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {Page} from './page.base';

import {GoogleChart} from '../../app/common/google.chart.component';
import {GoogleLineChart} from '../../app/common/google.line.chart.component';
import {
    CommonChartOptions, ChartData, SelectionEvent, LineChartOptions,
    ChartColumn
} from '../../app/common/chart.types';

@Component({
    template: `
        <google-chart
                [chartType]="chartType"
                [chartOptions]="chartOptions"
                [chartData]="chartData"
                height="345px"
                (selected)="selectHandler($event)"></google-chart>`
})
export class TestChartHostComponent {
    public chartType: string;
    public chartOptions: CommonChartOptions;
    public chartData: ChartData | google.visualization.DataTable | google.visualization.DataView;

    public selectHandler(selectionEvent: SelectionEvent) {
    }
}

export class ChartPage extends Page<TestChartHostComponent> {

    constructor(fixture: ComponentFixture<TestChartHostComponent>) {
        super(fixture);
    }

    public get chartElement(): DebugElement {
        return this.debugElement.query(By.directive(GoogleChart));
    }

    public get chartComponent(): GoogleChart {
        return this.chartElement.componentInstance;
    }

    public get chartArea(): DebugElement {
        return this.chartElement.query(By.css('div[id="' + this.chartComponent.id + '"]'));
    }
}

@Component({
    template: `
        <google-line-chart
                [chartOptions]="chartOptions"
                [chartData]="chartData"
                height="345px"
                (selected)="selectHandler($event)"
                [showControls]="true"></google-line-chart>`
})
export class TestLineChartHostComponent {
    public chartOptions: LineChartOptions;
    public chartData: ChartData | google.visualization.DataTable | google.visualization.DataView;

    public selectHandler(selectionEvent: SelectionEvent) {
    }
}

export class LineChartPage extends Page<TestLineChartHostComponent> {

    constructor(fixture: ComponentFixture<TestLineChartHostComponent>) {
        super(fixture);
    }

    public get chartElement(): DebugElement {
        return this.debugElement.query(By.directive(GoogleLineChart));
    }

    public get lineChartComponent(): GoogleLineChart {
        return this.chartElement.componentInstance;
    }

    public get chartComponent(): GoogleChart {
        return this.chartElement.query(By.directive(GoogleChart)).componentInstance;
    }

    public get displayedColumns(): ChartColumn[] {
        return JSON.parse((this.lineChartComponent.chartData as google.visualization.DataTable).toJSON()).cols;
    }

    public get chartArea(): DebugElement {
        return this.chartElement.query(By.css('div[id="' + this.chartComponent.id + '"]'));
    }
}