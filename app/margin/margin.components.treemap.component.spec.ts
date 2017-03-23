import {NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Router} from '@angular/router';

import {async, TestBed, fakeAsync, inject} from '@angular/core/testing';

import {
    RouterLinkStubDirective,
    HttpAsyncServiceStub,
    RouterStub,
    TreeMapPage,
    generateMarginComponents
} from '../../testing';

import {HttpService} from '../http.service';
import {MarginComponentsService} from './margin.components.service';

import {MarginComponentsTreemapComponent} from './margin.components.treemap.component';
import {MarginComponentsServerData} from './margin.types';

describe('Margin components TreeMap component', () => {
    let page: TreeMapPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule
            ],
            declarations: [
                MarginComponentsTreemapComponent,
                RouterLinkStubDirective
            ],
            providers: [
                MarginComponentsService,
                {
                    provide: HttpService, useClass: HttpAsyncServiceStub
                },
                {provide: Router, useClass: RouterStub}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<MarginComponentsServerData[]>) => {
        // Generate test data
        http.returnValue(generateMarginComponents());
        // Create component
        page = new TreeMapPage(TestBed.createComponent(MarginComponentsTreemapComponent));
    })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<MarginComponentsServerData[]>) => {
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
        (http: HttpAsyncServiceStub<MarginComponentsServerData[]>) => {
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
        expect(page.link.stub.navigatedTo).toEqual('/marginComponentLatest');
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