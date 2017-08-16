import {DecimalPipe} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {
    compileTestBed,
    GoogleChartStub,
    HttpAsyncServiceStub,
    NoopAnimationsCommonViewModule,
    RouterLinkStubDirective
} from '@dbg-riskit/dave-ui-testing';

import {ErrorType} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';
import {ChartRow} from '@dbg-riskit/dave-ui-charts';

import {BubbleChartPage, generatePositionReports} from '@dave/testing';

import {PositionReportsService} from './position.reports.service';

import {DATA_REFRESH_INTERVAL} from '../periodic.http.service';

import {
    compVarNegativeLegend,
    compVarPositiveLegend,
    PositionReportBubbleChartComponent
} from './position.report.bubblechart.component';
import {PositionReportServerData} from './position.report.types';
import {ROUTES} from '../routes/routing.paths';

xdescribe('Position reports bubble chart component', () => {
    let page: BubbleChartPage;

    compileTestBed(() => {
        return TestBed.configureTestingModule({
            imports     : [
                BrowserModule,
                NoopAnimationsCommonViewModule,
                FormsModule
            ],
            declarations: [
                PositionReportBubbleChartComponent,
                RouterLinkStubDirective,
                GoogleChartStub
            ],
            providers   : [
                PositionReportsService,
                {
                    provide : HttpService,
                    useClass: HttpAsyncServiceStub
                },
                DecimalPipe
            ]
        }).compileComponents();
    }, () => {
        page.destroy();
        page = null;
    });

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

            expect(page.initialLoadVisible)
                .toBeTruthy('Initial load component visible.');
            expect(page.noDataVisible)
                .toBeFalsy('No data component not visible.');
            expect(page.updateFailedVisible)
                .toBeFalsy('Update failed component not visible.');
            expect(page.googleChartVisible)
                .toBeFalsy('Chart component not visible.');

            // Return error
            http.throwError({
                status   : 500,
                message  : 'Error message',
                errorType: ErrorType.REQUEST
            });
            page.advanceHTTP();

            expect(page.initialLoadVisible)
                .toBeFalsy('Initial load component not visible.');
            expect(page.noDataVisible)
                .toBeFalsy('No data component not visible.');
            expect(page.updateFailedVisible)
                .toBeTruthy('Update failed component visible.');
            expect(page.googleChartVisible)
                .toBeFalsy('Chart component not visible.');
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadVisible)
                .toBeTruthy('Initial load component visible.');
            expect(page.noDataVisible)
                .toBeFalsy('No data component not visible.');
            expect(page.updateFailedVisible)
                .toBeFalsy('Update failed component not visible.');
            expect(page.googleChartVisible)
                .toBeFalsy('Chart component not visible.');

            // Return no data
            http.popReturnValue(); // Remove from queue
            http.returnValue([]); // Push empty array
            page.advanceHTTP();

            expect(page.initialLoadVisible)
                .toBeFalsy('Initial load component not visible.');
            expect(page.noDataVisible)
                .toBeTruthy('No data component visible.');
            expect(page.updateFailedVisible)
                .toBeFalsy('Update failed component not visible.');
            expect(page.googleChartVisible)
                .toBeFalsy('Chart component not visible.');
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

            page.expectStatesMatch('F', 'I', 20);

            page.selectMember(1);
            page.expectStatesMatch('G', 'I', 20);

            page.selectAccount(1);
            page.expectStatesMatch('G', 'J', 20);

            page.selectMember(0);
            page.expectStatesMatch('F', 'I', 20);

            page.selectMember(1);
            page.selectAccount(1);
            page.selectBubblesCount(2);
            page.expectStatesMatch('G', 'J', 30);

            // Generate new data
            http.returnValue(generatePositionReports());
            // Trigger auto refresh
            page.advanceAndDetectChanges(DATA_REFRESH_INTERVAL);
            page.expectStatesMatch('G', 'J', 30);

            // Generate new data
            http.returnValue(generatePositionReports(2, 1));
            // Trigger auto refresh
            page.advanceAndDetectChanges(DATA_REFRESH_INTERVAL);
            page.expectStatesMatch('G', 'I', 30);

            // Generate new data
            http.returnValue(generatePositionReports(1));
            // Trigger auto refresh
            page.advanceAndDetectChanges(DATA_REFRESH_INTERVAL);
            page.expectStatesMatch('F', 'I', 30);

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
        expect(page.link.stub.navigatedTo).toEqual(ROUTES.POSITION_REPORTS_LATEST);
    }));

    it('check data', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);
        // Return data
        page.advanceHTTP();

        page.matchTitle('20', '159.26%', '20', '66.67%', '1,080.00');
        expect(page.component.chartData.rows.length).toEqual(14);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(11);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(3);

        page.selectMember(1);

        page.matchTitle('20', '-57.41%', '20', '85.57%', '-1,080.00');
        page.expectStatesMatch('G', 'I', 20);
        expect(page.component.chartData.rows.length).toEqual(14);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(3);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(11);

        page.selectAccount(1);

        page.matchTitle('20', '159.26%', '20', '66.67%', '1,080.00');
        page.expectStatesMatch('G', 'J', 20);
        expect(page.component.chartData.rows.length).toEqual(14);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(11);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(3);

        page.selectMember(0);
        page.selectAccount(1);
        page.selectBubblesCount(2);

        page.matchTitle('30', '114.29%', '30', '66.67%', '840.00');
        page.expectStatesMatch('F', 'J', 30);

        expect(page.component.chartData.rows.length).toEqual(14);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(11);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(3);
    }));
});