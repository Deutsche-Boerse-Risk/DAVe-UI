import {NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {async, TestBed, fakeAsync, inject} from '@angular/core/testing';

import {
    click,
    RouterLinkStubDirective,
    HttpAsyncServiceStub,
    BubbleChartPage,
    generatePositionReports
} from '../../testing';

import {HttpService} from '../http.service';
import {PositionReportsService} from './position.reports.service';

import {
    PositionReportBubbleChartComponent, compVarPositiveLegend, compVarNegativeLegend
} from './position.report.bubblechart.component';
import {PositionReportServerData} from './position.report.types';
import {ChartRow} from '../common/chart.types';

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
                }
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
            page.advance(1000);

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
            page.advance(1000);

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
        page.advance(1000);

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
            page.advance(1000);

            page.expectStatesMatch('A', 'A', 20);

            page.selectMember(1);
            page.expectStatesMatch('B', 'A', 20);

            page.selectAccount(1);
            page.expectStatesMatch('B', 'B', 20);

            page.selectMember(0);
            page.expectStatesMatch('A', 'A', 20);


            page.selectMember(1);
            page.selectAccount(1);
            page.selectBubblesCount(2);
            page.expectStatesMatch('B', 'B', 30);

            // Generate new data
            http.returnValue(generatePositionReports());
            // Trigger auto refresh
            page.advance(60000);
            page.expectStatesMatch('B', 'B', 30);

            // Generate new data
            http.returnValue(generatePositionReports(2, 1));
            // Trigger auto refresh
            page.advance(60000);
            page.expectStatesMatch('B', 'A', 30);

            // Generate new data
            http.returnValue(generatePositionReports(1));
            // Trigger auto refresh
            page.advance(60000);
            page.expectStatesMatch('A', 'A', 30);

            // Trigger auto refresh with no data
            page.advance(60000);
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
        expect(() => click(page.viewDetails)).toThrow();

        // Return data
        page.advance(1000);

        // Already shown
        let navigateSpy = spyOn(page.viewDetailsStub, 'onClick').and.callThrough();
        expect(() => click(page.viewDetails)).not.toThrow();

        // Clicked correctly
        expect(navigateSpy).toHaveBeenCalled();
        expect(page.viewDetailsStub.navigatedTo).toEqual('/positionReportLatest');
    }));

    it('check data', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);
        // Return data
        page.advance(1000);

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
        page.expectStatesMatch('B', 'A', 20);
        expect(page.component.chartData.rows.length).toEqual(7);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(5);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(2);

        page.selectAccount(1);

        page.matchTitle('20', '0.00%', '20', '0.00%', '0.00');
        page.expectStatesMatch('B', 'B', 20);
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
        page.expectStatesMatch('B', 'C', 30);

        expect(page.component.chartData.rows.length).toEqual(7);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(5);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(2);
    }));
});