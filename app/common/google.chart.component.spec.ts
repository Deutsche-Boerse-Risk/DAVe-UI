import {Component, DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

import {fakeAsync, tick, ComponentFixture, TestBed, async, ComponentFixtureAutoDetect} from "@angular/core/testing";

import {waitForChart, dispatchEvent} from "../../testing";

import {GoogleChart} from "./google.chart.component";
import {CommonChartOptions, ChartData, SelectionEvent, LineChartOptions} from "./chart.types";

@Component({
    template: ` <google-chart *ngIf="chartData"
                      [chartType]="chartType"
                      [chartOptions]="chartOptions"
                      [chartData]="chartData"
                      height="345px"
                      (selected)="selectHandler($event)"></google-chart>`
})
class TestHostComponent {
    public chartType: string;
    public chartOptions: CommonChartOptions;
    public chartData: ChartData | google.visualization.DataTable | google.visualization.DataView;

    public selectHandler(selectionEvent: SelectionEvent) {
    }
}

class ChartPage {

    public hostComponent: TestHostComponent;
    public hostDebugElement: DebugElement;

    constructor(public fixture: ComponentFixture<TestHostComponent>) {
        this.hostComponent = this.fixture.componentInstance;
        this.hostDebugElement = this.fixture.debugElement;
    }

    public get debugElement(): DebugElement {
        return this.hostDebugElement.query(By.directive(GoogleChart));
    }

    public get chartComponent(): GoogleChart {
        return this.debugElement.componentInstance;
    }
}

const dummyChartData: ChartData = {
    cols: [
        {
            id: 'Year',
            type: 'string'
        }, {
            id: 'Sales',
            type: 'number'
        }, {
            id: 'Expenses',
            type: 'number'
        }
    ],
    rows: [
        {
            c: [
                {
                    v: '2004'
                }, {
                    v: 1000
                }, {
                    v: 400
                }
            ]
        },
        {
            c: [
                {
                    v: '2005'
                }, {
                    v: 1170
                }, {
                    v: 460
                }
            ]
        },
        {
            c: [
                {
                    v: '2006'
                }, {
                    v: 660
                }, {
                    v: 1120
                }
            ]
        },
        {
            c: [
                {
                    v: '2007'
                }, {
                    v: 1030
                }, {
                    v: 540
                }
            ]
        }
    ]
};

describe('GoogleChart component', () => {

    let page: ChartPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GoogleChart, TestHostComponent],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new ChartPage(TestBed.createComponent(TestHostComponent));
        page.fixture.detectChanges();
        tick();
    }));

    it('is rendering chart and does re-render on changes', (done: DoneFn) => {
        page.hostComponent.chartType = 'LineChart';
        let chartOptions: LineChartOptions = {
            title: 'Company Performance',
            curveType: 'function',
            legend: {position: 'bottom'}
        };
        page.hostComponent.chartOptions = chartOptions;
        page.hostComponent.chartData = dummyChartData;

        page.fixture.detectChanges();
        waitForChart(page.chartComponent, () => {
            expect(page.chartComponent.chartOptions).toEqual(chartOptions);

            let chartDiv = page.debugElement.query(By.css('div[id="' + page.chartComponent.id + '"]'));
            expect(chartDiv).not.toBeNull();
            expect(chartDiv.nativeElement.childNodes.length).not.toBe(0);

            chartOptions = {
                title: 'Company Performance',
                legend: {position: 'bottom'}
            };
            page.hostComponent.chartOptions = chartOptions;

            let prepareDataTableOrDataViewSpy = spyOn(GoogleChart, 'prepareDataTableOrDataView').and.callThrough();
            let drawGraphSpy = spyOn(page.chartComponent, 'drawGraph').and.callThrough();

            waitForChart(page.chartComponent, () => {
                expect(page.chartComponent.chartOptions).toEqual(chartOptions);
                expect(prepareDataTableOrDataViewSpy).toHaveBeenCalled();
                expect(drawGraphSpy).toHaveBeenCalled();

                waitForChart(page.chartComponent, () => {
                    expect(prepareDataTableOrDataViewSpy).toHaveBeenCalledTimes(2);
                    expect(drawGraphSpy).toHaveBeenCalledTimes(2);
                    done();
                });
                dispatchEvent(window, 'resize');
            });
            page.fixture.detectChanges();
        });
    }, 15000 /** Timeout 15s; charts are slow */);

    it('accepts DataTable', (done: DoneFn) => {
        google.charts.setOnLoadCallback(() => {
            page.hostComponent.chartType = 'LineChart';
            let chartOptions: LineChartOptions = {
                title: 'Company Performance',
                curveType: 'function',
                legend: {position: 'bottom'}
            };
            page.hostComponent.chartOptions = chartOptions;
            page.hostComponent.chartData = new google.visualization.DataTable(dummyChartData);

            page.fixture.detectChanges();
            waitForChart(page.chartComponent, () => {
                let chartDiv = page.debugElement.query(By.css('div[id="' + page.chartComponent.id + '"]'));
                expect(chartDiv).not.toBeNull();
                expect(chartDiv.nativeElement.childNodes.length).not.toBe(0);

                let prepareDataTableOrDataViewSpy = spyOn(GoogleChart, 'prepareDataTableOrDataView').and.callThrough();
                let drawGraphSpy = spyOn(page.chartComponent, 'drawGraph').and.callThrough();

                waitForChart(page.chartComponent, () => {
                    let chartDiv = page.debugElement.query(By.css('div[id="' + page.chartComponent.id + '"]'));
                    expect(chartDiv).not.toBeNull();
                    expect(chartDiv.nativeElement.childNodes.length).not.toBe(0);

                    expect(prepareDataTableOrDataViewSpy).toHaveBeenCalled();
                    expect(drawGraphSpy).toHaveBeenCalled();

                    done();
                });
                let data = new google.visualization.DataTable();
                data.addColumn('number', 'Day');
                data.addColumn('number', 'Guardians of the Galaxy');
                data.addColumn('number', 'The Avengers');
                data.addColumn('number', 'Transformers: Age of Extinction');

                data.addRows([
                    [1, 37.8, 80.8, 41.8],
                    [2, 30.9, 69.5, 32.4],
                    [3, 25.4, 57, 25.7],
                    [4, 11.7, 18.8, 10.5],
                    [5, 11.9, 17.6, 10.4],
                    [6, 8.8, 13.6, 7.7],
                    [7, 7.6, 12.3, 9.6],
                    [8, 12.3, 29.2, 10.6],
                    [9, 16.9, 42.9, 14.8],
                    [10, 12.8, 30.9, 11.6],
                    [11, 5.3, 7.9, 4.7],
                    [12, 6.6, 8.4, 5.2],
                    [13, 4.8, 6.3, 3.6],
                    [14, 4.2, 6.2, 3.4]
                ]);

                page.hostComponent.chartData = data;
                page.fixture.detectChanges();
            });
        });
    }, 15000 /** Timeout 15s; charts are slow */);

    it('accepts DataView', (done: DoneFn) => {
        google.charts.setOnLoadCallback(() => {
            page.hostComponent.chartType = 'LineChart';
            let chartOptions: LineChartOptions = {
                title: 'Company Performance',
                curveType: 'function',
                legend: {position: 'bottom'}
            };
            page.hostComponent.chartOptions = chartOptions;
            page.hostComponent.chartData = new google.visualization.DataView(new google.visualization.DataTable(dummyChartData));

            page.fixture.detectChanges();
            waitForChart(page.chartComponent, () => {
                let chartDiv = page.debugElement.query(By.css('div[id="' + page.chartComponent.id + '"]'));
                expect(chartDiv).not.toBeNull();
                expect(chartDiv.nativeElement.childNodes.length).not.toBe(0);

                let prepareDataTableOrDataViewSpy = spyOn(GoogleChart, 'prepareDataTableOrDataView').and.callThrough();
                let drawGraphSpy = spyOn(page.chartComponent, 'drawGraph').and.callThrough();

                waitForChart(page.chartComponent, () => {
                    let chartDiv = page.debugElement.query(By.css('div[id="' + page.chartComponent.id + '"]'));
                    expect(chartDiv).not.toBeNull();
                    expect(chartDiv.nativeElement.childNodes.length).not.toBe(0);

                    expect(prepareDataTableOrDataViewSpy).toHaveBeenCalled();
                    expect(drawGraphSpy).toHaveBeenCalled();

                    done();
                });
                let data = new google.visualization.DataTable();
                data.addColumn('number', 'Day');
                data.addColumn('number', 'Guardians of the Galaxy');
                data.addColumn('number', 'The Avengers');
                data.addColumn('number', 'Transformers: Age of Extinction');

                data.addRows([
                    [1, 37.8, 80.8, 41.8],
                    [2, 30.9, 69.5, 32.4],
                    [3, 25.4, 57, 25.7],
                    [4, 11.7, 18.8, 10.5],
                    [5, 11.9, 17.6, 10.4],
                    [6, 8.8, 13.6, 7.7],
                    [7, 7.6, 12.3, 9.6],
                    [8, 12.3, 29.2, 10.6],
                    [9, 16.9, 42.9, 14.8],
                    [10, 12.8, 30.9, 11.6],
                    [11, 5.3, 7.9, 4.7],
                    [12, 6.6, 8.4, 5.2],
                    [13, 4.8, 6.3, 3.6],
                    [14, 4.2, 6.2, 3.4]
                ]);

                page.hostComponent.chartData = new google.visualization.DataView(data);
                page.fixture.detectChanges();
            });
        });
    }, 15000 /** Timeout 15s; charts are slow */);
});