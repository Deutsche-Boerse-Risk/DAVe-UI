import {LocationStrategy} from '@angular/common';
import {NO_ERRORS_SCHEMA, DebugElement} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {async, TestBed, fakeAsync, inject} from '@angular/core/testing';

import {
    RouterStub,
    LocationStrategyStub,
    ActivatedRouteStub,
    HistoryListPage,
    RouterLinkStubDirective,
    HttpAsyncServiceStub,
    generateMarginComponentsHistory,
    chceckSorting
} from '../../testing';

import {MarginComponentsServerData} from './margin.types';
import {MarginComponentsService} from './margin.components.service';
import {HttpService} from '../http.service';

import {valueGetters} from './margin.components.latest.component';
import {MarginComponentsHistoryComponent} from './margin.components.history.component';
import {ListModule} from '../list/list.module';
import {DataTableModule} from '../datatable/data.table.module';
import {HIGHLIGHTER_CLASS} from '../datatable/highlighter.directive';

describe('Position reports history component', () => {
    let page: HistoryListPage<MarginComponentsHistoryComponent>;
    let testingParams = ['A', 'A', 'B', 'C', '*'];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ListModule,
                DataTableModule
            ],
            declarations: [
                MarginComponentsHistoryComponent,
                RouterLinkStubDirective
            ],
            providers: [
                MarginComponentsService,
                {
                    provide: HttpService, useClass: HttpAsyncServiceStub
                },
                {provide: Router, useClass: RouterStub},
                {provide: ActivatedRoute, useClass: ActivatedRouteStub},
                {provide: LocationStrategy, useClass: LocationStrategyStub}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(inject([HttpService, ActivatedRoute],
        (http: HttpAsyncServiceStub<MarginComponentsServerData[]>, activatedRoute: ActivatedRouteStub) => {
            // Generate test data
            http.returnValue(generateMarginComponentsHistory());

            // Set input parameters
            activatedRoute.testParams = {
                clearer: testingParams[0],
                member: testingParams[1],
                account: testingParams[2],
                class: testingParams[3],
                ccy: testingParams[4]
            };

            // Create component
            page = new HistoryListPage<MarginComponentsHistoryComponent>(
                TestBed.createComponent(MarginComponentsHistoryComponent));
        })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<MarginComponentsServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadComponent).not.toBeNull('Initial load component visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');
            expect(page.lineChart).toBeNull('Chart not visible.');

            // Return error
            http.throwError({
                status: 500,
                message: 'Error message'
            });
            page.advance(1000);

            expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).not.toBeNull('Update failed component visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');
            expect(page.lineChart).toBeNull('Chart not visible.');
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<MarginComponentsServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadComponent).not.toBeNull('Initial load component visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');
            expect(page.lineChart).toBeNull('Chart not visible.');

            // Return no data
            http.popReturnValue(); // Remove from queue
            http.returnValue([]); // Push empty array
            page.advance(1000);

            expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).not.toBeNull('No data component visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');
            expect(page.lineChart).toBeNull('Chart not visible.');
        })));

    it('displays data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<MarginComponentsServerData[]>) => {
            let httpSpy = spyOn(http, 'get').and.callThrough();
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadComponent).not.toBeNull('Initial load component visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');
            expect(page.lineChart).toBeNull('Chart not visible.');

            // Return data
            page.advance(1000);

            expect(httpSpy).toHaveBeenCalled();
            expect(httpSpy.calls.mostRecent().args[0].params).toEqual(testingParams);

            expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).not.toBeNull('Data table visible.');
            expect(page.lineChart).not.toBeNull('Chart visible.');

            // Fire highlighters
            page.advance(15000);
        })));

    it('data correctly refreshed', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<MarginComponentsServerData[]>) => {
            // Init component
            page.detectChanges();
            // Return data
            page.advance(1000);

            expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).not.toBeNull('Data table visible.');
            expect(page.lineChart).not.toBeNull('Chart visible.');

            expect(page.dataTable.body.tableRowElements.every((row: DebugElement) => {
                return row.nativeElement.classList.contains(HIGHLIGHTER_CLASS)
            })).toBeTruthy('All rows are highlighted');

            // Fire highlighters
            page.advance(15000);

            expect(page.dataTable.body.tableRowElements.every((row: DebugElement) => {
                return !row.nativeElement.classList.contains(HIGHLIGHTER_CLASS)
            })).toBeTruthy('No rows are highlighted');

            // Push new data
            let newData = generateMarginComponentsHistory();
            http.returnValue(newData);
            // Trigger reload
            page.advance(44000);
            // Return the data
            page.advance(1000);

            expect(page.dataTable.element).not.toBeNull('Data table visible.');
            expect(page.lineChart).not.toBeNull('Chart visible.');

            expect(page.dataTable.body.tableRowElements.every((row: DebugElement) => {
                return row.nativeElement.classList.contains(HIGHLIGHTER_CLASS)
            })).toBeTruthy('All rows are highlighted');

            // Fire highlighters
            page.advance(15000);

            expect(page.dataTable.body.tableRowElements.every((row: DebugElement) => {
                return !row.nativeElement.classList.contains(HIGHLIGHTER_CLASS)
            })).toBeTruthy('No rows are highlighted');

            // Return the same data
            http.returnValue(newData);
            // Trigger reload
            page.advance(44000);
            // Return the data
            page.advance(1000);

            expect(page.dataTable.body.tableRowElements.every((row: DebugElement) => {
                return !row.nativeElement.classList.contains(HIGHLIGHTER_CLASS)
            })).toBeTruthy('No rows are highlighted');

            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);
        })));

    xit('displays data correctly', fakeAsync(() => {
    }));

    xit('has chart data correctly processed', fakeAsync(() => {
    }));

    xit('has correct breadcrumbs navigation', fakeAsync(() => {
    }));

    xit('has download working', fakeAsync(() => {
    }));

    it('can be sorted correctly', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Return data
        page.advance(1000);
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);

        chceckSorting(page, [valueGetters.received, valueGetters.variationMargin, valueGetters.liquiMargin,
            valueGetters.premiumMargin, valueGetters.spreadMargin, valueGetters.additionalMargin]);

        // Fire highlighters
        page.advance(15000);
    }));

    xit('has correct pager', fakeAsync(() => {
    }));
});