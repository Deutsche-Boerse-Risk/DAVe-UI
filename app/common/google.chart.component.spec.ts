import {fakeAsync, TestBed, async, ComponentFixtureAutoDetect} from "@angular/core/testing";

import {dispatchEvent, ChartPage, TestChartHostComponent} from "../../testing";

import {GoogleChart} from "./google.chart.component";
import {ChartData, LineChartOptions} from "./chart.types";

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
            declarations: [GoogleChart, TestChartHostComponent],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new ChartPage(TestBed.createComponent(TestChartHostComponent));
        page.detectChanges();
    }));

    it('is rendering chart and does re-render on changes', (done: DoneFn) => {
        google.charts.setOnLoadCallback(fakeAsync(() => {
            page.component.chartType = 'LineChart';
            let chartOptions: LineChartOptions = {
                title: 'Company Performance',
                curveType: 'function',
                legend: {position: 'bottom'}
            };
            page.component.chartOptions = chartOptions;
            page.component.chartData = dummyChartData;

            page.detectChanges();

            expect(page.chartComponent.chartOptions).toEqual(chartOptions);

            expect(page.chartArea).not.toBeNull();
            expect(page.chartArea.nativeElement.childNodes.length).not.toBe(0);

            chartOptions = {
                title: 'Company Performance',
                legend: {position: 'bottom'}
            };
            page.component.chartOptions = chartOptions;

            let prepareDataTableOrDataViewSpy = spyOn(GoogleChart, 'prepareDataTableOrDataView').and.callThrough();
            let drawGraphSpy = spyOn(page.chartComponent, 'drawGraph').and.callThrough();

            page.detectChanges();

            expect(page.chartComponent.chartOptions).toEqual(chartOptions);
            expect(prepareDataTableOrDataViewSpy).toHaveBeenCalled();
            expect(drawGraphSpy).toHaveBeenCalled();

            dispatchEvent(window, 'resize');
            page.detectChanges();

            expect(prepareDataTableOrDataViewSpy).toHaveBeenCalledTimes(2);
            expect(drawGraphSpy).toHaveBeenCalledTimes(2);

            done();
        }));
    }, 60000);

    it('accepts DataTable', (done: DoneFn) => {
        google.charts.setOnLoadCallback(fakeAsync(() => {
            page.component.chartType = 'LineChart';
            let chartOptions: LineChartOptions = {
                title: 'Company Performance',
                curveType: 'function',
                legend: {position: 'bottom'}
            };
            page.component.chartOptions = chartOptions;
            page.component.chartData = new google.visualization.DataTable(dummyChartData);

            page.detectChanges();

            expect(page.chartArea).not.toBeNull();
            expect(page.chartArea.nativeElement.childNodes.length).not.toBe(0);

            let prepareDataTableOrDataViewSpy = spyOn(GoogleChart, 'prepareDataTableOrDataView').and.callThrough();
            let drawGraphSpy = spyOn(page.chartComponent, 'drawGraph').and.callThrough();

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

            page.component.chartData = data;
            page.detectChanges();

            expect(page.chartArea).not.toBeNull();
            expect(page.chartArea.nativeElement.childNodes.length).not.toBe(0);

            expect(prepareDataTableOrDataViewSpy).toHaveBeenCalled();
            expect(drawGraphSpy).toHaveBeenCalled();

            done();
        }));
    }, 60000);

    it('accepts DataView', (done: DoneFn) => {
        google.charts.setOnLoadCallback(fakeAsync(() => {
            page.component.chartType = 'LineChart';
            let chartOptions: LineChartOptions = {
                title: 'Company Performance',
                curveType: 'function',
                legend: {position: 'bottom'}
            };
            page.component.chartOptions = chartOptions;
            page.component.chartData = new google.visualization.DataView(new google.visualization.DataTable(dummyChartData));

            page.detectChanges();

            expect(page.chartArea).not.toBeNull();
            expect(page.chartArea.nativeElement.childNodes.length).not.toBe(0);

            let prepareDataTableOrDataViewSpy = spyOn(GoogleChart, 'prepareDataTableOrDataView').and.callThrough();
            let drawGraphSpy = spyOn(page.chartComponent, 'drawGraph').and.callThrough();

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

            page.component.chartData = new google.visualization.DataView(data);
            page.detectChanges();

            expect(page.chartArea).not.toBeNull();
            expect(page.chartArea.nativeElement.childNodes.length).not.toBe(0);

            expect(prepareDataTableOrDataViewSpy).toHaveBeenCalled();
            expect(drawGraphSpy).toHaveBeenCalled();

            done();
        }));
    }, 60000);
});