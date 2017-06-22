import {BrowserModule} from '@angular/platform-browser';
import {Router} from '@angular/router';

import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {
    compileTestBed,
    GoogleChartStub,
    HttpAsyncServiceStub,
    RouterLinkStubDirective,
    RouterStub
} from '@dbg-riskit/dave-ui-testing';

import {ErrorType} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';
import {NoopAnimationsCommonViewModule} from '@dbg-riskit/dave-ui-view';

import {generateLiquiGroupMargin, TreeMapPage} from '@dave/testing';

import {LiquiGroupMarginService} from './liqui.group.margin.service';

import {LiquiGroupMarginTreemapComponent} from './liqui.group.margin.treemap.component';
import {LiquiGroupMarginServerData} from './liqui.group.margin.types';
import {ROUTES} from '../routes/routing.paths';

describe('Margin components TreeMap component', () => {
    let page: TreeMapPage;

    compileTestBed(() => {
        return TestBed.configureTestingModule({
            imports     : [
                BrowserModule,
                NoopAnimationsCommonViewModule
            ],
            declarations: [
                LiquiGroupMarginTreemapComponent,
                RouterLinkStubDirective,
                GoogleChartStub
            ],
            providers   : [
                LiquiGroupMarginService,
                {
                    provide : HttpService,
                    useClass: HttpAsyncServiceStub
                },
                {
                    provide : Router,
                    useClass: RouterStub
                }
            ]
        }).compileComponents();
    });

    beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>) => {
        // Generate test data
        http.returnValue(generateLiquiGroupMargin());
        // Create component
        page = new TreeMapPage(TestBed.createComponent(LiquiGroupMarginTreemapComponent));
    })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>) => {
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
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>) => {
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
        expect(page.link.stub.navigatedTo).toEqual(ROUTES.LIQUI_GROUP_MARGIN_LATEST);
    }));

    xit('check data', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);
        // Return data
        page.advanceHTTP();

        // expect(page.component.chartData.rows.length).toEqual(7);
        // expect(page.component.chartData.rows.filter((row: ChartRow) => {
        //     return row.c[3].v === compVarPositiveLegend;
        // }).length).toEqual(5);
    }));

    xit('chart selection works', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);
        // Return data
        page.advanceHTTP();

        // expect(page.component.chartData.rows.length).toEqual(7);
        // expect(page.component.chartData.rows.filter((row: ChartRow) => {
        //     return row.c[3].v === compVarPositiveLegend;
        // }).length).toEqual(5);
    }));
});