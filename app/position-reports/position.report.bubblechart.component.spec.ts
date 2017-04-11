import {DecimalPipe} from '@angular/common';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {async, TestBed, fakeAsync, inject} from '@angular/core/testing';

import {
    RouterLinkStubDirective,
    HttpAsyncServiceStub,
    BubbleChartPage,
    generatePositionReports
} from '../../testing';

import {HttpService} from '../http.service';
import {PositionReportsService} from './position.reports.service';

import {DATA_REFRESH_INTERVAL} from '../abstract.component';

import {
    PositionReportBubbleChartComponent, compVarPositiveLegend, compVarNegativeLegend
} from './position.report.bubblechart.component';
import {PositionReportServerData} from './position.report.types';
import {ChartRow} from '../charts/chart.types';

describe('Position reports bubble chart component', () => {
    let page: BubbleChartPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                FormsModule
            ],
            declarations: [
                PositionReportBubbleChartComponent,
                RouterLinkStubDirective
            ],
            providers: [
                PositionReportsService,
                {
                    provide: HttpService, useClass: HttpAsyncServiceStub
                },
                DecimalPipe
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
        // Generate test data
        http.returnValue(generatePositionReports());
        // Create component
        page = new BubbleChartPage(TestBed.createComponent(PositionReportBubbleChartComponent));
    })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadVisible).toBeTruthy('Initial load component visible.');
            expect(page.noDataVisible).toBeFalsy('No data component not visible.');
            expect(page.updateFailedVisible).toBeFalsy('Update failed component not visible.');
            expect(page.googleChartVisible).toBeFalsy('Chart component not visible.');

            // Return error
            http.throwError({
                status: 500,
                message: 'Error message'
            });
            page.advanceHTTP();

            expect(page.initialLoadVisible).toBeFalsy('Initial load component not visible.');
            expect(page.noDataVisible).toBeFalsy('No data component not visible.');
            expect(page.updateFailedVisible).toBeTruthy('Update failed component visible.');
            expect(page.googleChartVisible).toBeFalsy('Chart component not visible.');
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadVisible).toBeTruthy('Initial load component visible.');
            expect(page.noDataVisible).toBeFalsy('No data component not visible.');
            expect(page.updateFailedVisible).toBeFalsy('Update failed component not visible.');
            expect(page.googleChartVisible).toBeFalsy('Chart component not visible.');

            // Return no data
            http.popReturnValue(); // Remove from queue
            http.returnValue([]); // Push empty array
            page.advanceHTTP();

            expect(page.initialLoadVisible).toBeFalsy('Initial load component not visible.');
            expect(page.noDataVisible).toBeTruthy('No data component visible.');
            expect(page.updateFailedVisible).toBeFalsy('Update failed component not visible.');
            expect(page.googleChartVisible).toBeFalsy('Chart component not visible.');
        })));

    it('displays chart correctly', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);

        expect(page.initialLoadVisible).toBeTruthy('Initial load component visible.');
        expect(page.noDataVisible).toBeFalsy('No data component not visible.');
        expect(page.updateFailedVisible).toBeFalsy('Update failed component not visible.');
        expect(page.googleChartVisible).toBeFalsy('Chart component not visible.');

        // Return data
        page.advanceHTTP();

        expect(page.initialLoadVisible).toBeFalsy('Initial load component not visible.');
        expect(page.noDataVisible).toBeFalsy('No data component not visible.');
        expect(page.updateFailedVisible).toBeFalsy('Update failed component not visible.');
        expect(page.googleChartVisible).toBeTruthy('Chart component visible.');
    }));

    it('selection works correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
            // Init component
            page.detectChanges();

            // Return data
            page.advanceHTTP();

            page.expectStatesMatch('B', 'E', 20);

            page.selectMember(1);
            page.expectStatesMatch('C', 'E', 20);

            page.selectAccount(1);
            page.expectStatesMatch('C', 'F', 20);

            page.selectMember(0);
            page.expectStatesMatch('B', 'E', 20);


            page.selectMember(1);
            page.selectAccount(1);
            page.selectBubblesCount(2);
            page.expectStatesMatch('C', 'F', 30);

            // Generate new data
            http.returnValue(generatePositionReports());
            // Trigger auto refresh
            page.advanceAndDetectChanges(DATA_REFRESH_INTERVAL);
            page.expectStatesMatch('C', 'F', 30);

            // Generate new data
            http.returnValue(generatePositionReports(2, 1));
            // Trigger auto refresh
            page.advanceAndDetectChanges(DATA_REFRESH_INTERVAL);
            page.expectStatesMatch('C', 'E', 30);

            // Generate new data
            http.returnValue(generatePositionReports(1));
            // Trigger auto refresh
            page.advanceAndDetectChanges(DATA_REFRESH_INTERVAL);
            page.expectStatesMatch('B', 'E', 30);

            // Trigger auto refresh with no data
            page.advanceAndDetectChanges(DATA_REFRESH_INTERVAL);
            page.expectStatesMatch(undefined, undefined, 30);

            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);
        })));

    it('detail links navigates', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);


        //Does not exists, yet
        expect(() => page.link.click()).toThrow();

        // Return data
        page.advanceHTTP();

        // Already shown
        let navigateSpy = spyOn(page.link.stub, 'onClick').and.callThrough();
        expect(() => page.link.click()).not.toThrow();

        // Clicked correctly
        expect(navigateSpy).toHaveBeenCalled();
        expect(page.link.stub.navigatedTo).toEqual('/positionReportLatest');
    }));

    it('check data', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);
        // Return data
        page.advanceHTTP();

        page.matchTitle('20', '10,800.00%', '20', '66.67%', '0.00');
        expect(page.component.chartData.rows.length).toEqual(7);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(5);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(2);

        page.selectMember(1);

        page.matchTitle('20', '21,600.00%', '20', '66.67%', '0.00');
        page.expectStatesMatch('C', 'E', 20);
        expect(page.component.chartData.rows.length).toEqual(7);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(5);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(2);

        page.selectAccount(1);

        page.matchTitle('20', '0.00%', '20', '0.00%', '0.00');
        page.expectStatesMatch('C', 'F', 20);
        expect(page.component.chartData.rows.length).toEqual(8);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(8);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(0);

        page.selectAccount(2);
        page.selectBubblesCount(2);

        page.matchTitle('30', '10,800.00%', '30', '66.67%', '0.00');
        page.expectStatesMatch('C', 'G', 30);

        expect(page.component.chartData.rows.length).toEqual(7);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(5);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(2);
    }));
});