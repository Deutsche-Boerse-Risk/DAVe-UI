import {fakeAsync, TestBed, async} from '@angular/core/testing';

import {LineChartPage, TestLineChartHostComponent} from '../../testing';

import {GoogleLineChart} from './google.line.chart.component';
import {ChartData, LineChartOptions} from './chart.types';
import {GoogleChart} from './google.chart.component';

const dummyChartData: ChartData = {
    cols: [
        {
            id: 'Year',
            type: 'string'
        }, {
            id: 'Sales',
            type: 'number',
            label: 'Sales'
        }, {
            id: 'Expenses',
            type: 'number',
            label: 'Expenses'
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

const chartOptions: LineChartOptions = {
    title: 'Company Performance',
    curveType: 'function',
    legend: {position: 'bottom'},
    series: [
        {
            color: '#31C0BE'
        },
        {
            color: '#c7254e'
        },
        {
            color: '#800000'
        },
        {
            color: '#808000'
        },
        {
            color: '#FF00FF'
        },
        {
            color: '#006fff'
        }
    ]
};

describe('GoogleLineChart component', () => {

    let page: LineChartPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GoogleLineChart, GoogleChart, TestLineChartHostComponent]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new LineChartPage(TestBed.createComponent(TestLineChartHostComponent));
        page.detectChanges();
    }));

    it('is line chart', fakeAsync(() => {
        page.component.chartOptions = chartOptions;
        page.component.chartData = dummyChartData;

        page.detectChanges();
        expect(page.chartComponent.chartType).toEqual('LineChart');
    }));

    it('is rendering chart and does re-render on changes', (done: DoneFn) => {
        google.charts.setOnLoadCallback(fakeAsync(() => {
            page.component.chartOptions = chartOptions;
            page.component.chartData = dummyChartData;

            page.detectChanges();
            expect(page.chartComponent.chartOptions).toEqual(chartOptions);

            expect(page.chartArea).not.toBeNull();
            expect(page.chartArea.nativeElement.childNodes.length).not.toBe(0);

            let drawGraphSpy = spyOn((page.chartComponent as any).wrapper.getChart(), 'draw').and.callThrough();

            page.lineChartComponent.hideColumn(1);
            page.detectChanges();

            expect(drawGraphSpy).toHaveBeenCalled();
            expect(page.displayedColumns.length).toBe(2);

            page.lineChartComponent.hideColumn(1);
            page.detectChanges();

            expect(drawGraphSpy).toHaveBeenCalledTimes(2);
            expect(page.displayedColumns.length).toBe(3);

            page.lineChartComponent.singleLineSelection = true;
            page.lineChartComponent.hideColumn(2);
            page.detectChanges();

            expect(drawGraphSpy).toHaveBeenCalledTimes(3);
            expect(page.displayedColumns.length).toBe(2);

            done();
        }));
    }, 60000);

    it('accepts DataTable', (done: DoneFn) => {
        google.charts.setOnLoadCallback(fakeAsync(() => {
            page.component.chartOptions = chartOptions;
            page.component.chartData = new google.visualization.DataTable(dummyChartData);

            page.detectChanges();

            expect(page.chartArea).not.toBeNull();
            expect(page.chartArea.nativeElement.childNodes.length).not.toBe(0);

            let drawGraphSpy = spyOn(page.chartComponent as any, 'drawGraph').and.callThrough();

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

            expect(drawGraphSpy).toHaveBeenCalled();

            done();
        }));
    }, 60000);

    it('accepts DataView', (done: DoneFn) => {
        google.charts.setOnLoadCallback(fakeAsync(() => {
            page.component.chartOptions = chartOptions;
            page.component.chartData = new google.visualization.DataView(new google.visualization.DataTable(dummyChartData));

            page.detectChanges();

            expect(page.chartArea).not.toBeNull();
            expect(page.chartArea.nativeElement.childNodes.length).not.toBe(0);

            let drawGraphSpy = spyOn(page.chartComponent as any, 'drawGraph').and.callThrough();

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

            expect(drawGraphSpy).toHaveBeenCalled();

            done();
        }));
    }, 60000);
});