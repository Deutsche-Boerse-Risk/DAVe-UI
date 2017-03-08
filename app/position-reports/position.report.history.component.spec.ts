import {LocationStrategy} from "@angular/common";
import {NO_ERRORS_SCHEMA, DebugElement} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";

import {async, TestBed, fakeAsync, inject} from "@angular/core/testing";

import {
    RouterStub,
    LocationStrategyStub,
    ActivatedRouteStub,
    HistoryListPage,
    RouterLinkStubDirective,
    HttpAsyncServiceStub,
    generatePositionReportsHistory
} from "../../testing";

import {PositionReportServerData} from "./position.report.types";
import {PositionReportsService} from "./position.reports.service";
import {HttpService} from "../http.service";

import {PositionReportHistoryComponent} from "./position.report.history.component";
import {ListModule} from "../list/list.module";
import {DataTableModule} from "../datatable/data.table.module";
import {HIGHLIGHTER_CLASS} from "../datatable/highlighter.directive";

describe('Position reports history component', () => {
    let page: HistoryListPage<PositionReportHistoryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ListModule,
                DataTableModule
            ],
            declarations: [
                PositionReportHistoryComponent,
                RouterLinkStubDirective
            ],
            providers: [
                PositionReportsService,
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
        (http: HttpAsyncServiceStub<PositionReportServerData[]>, activatedRoute: ActivatedRouteStub) => {
            // Generate test data
            http.returnValue(generatePositionReportsHistory());

            // Set input parameters
            activatedRoute.testParams = {
                clearer: 'A',
                member: 'A',
                account: 'B',
                class: 'C',
                symbol: '*',
                putCall: 'P',
                strikePrice: '152',
                optAttribute: '*',
                maturityMonthYear: '201211'
            };

            // Create component
            page = new HistoryListPage<PositionReportHistoryComponent>(TestBed.createComponent(PositionReportHistoryComponent));
        })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
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
        (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
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

    it('displays data table', fakeAsync(() => {
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

        expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
        expect(page.noDataComponent).toBeNull('No data component not visible.');
        expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
        expect(page.dataTable.element).not.toBeNull('Data table visible.');
        expect(page.lineChart).not.toBeNull('Chart visible.');

        // Fire highlighters
        page.advance(15000);
    }));

    it('data correctly refreshed', fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
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
        http.returnValue(generatePositionReportsHistory());
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

        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);
    })));

    xit('data correctly displayed', () => {
    });

    xit('chart data correctly processed', () => {
    });

    xit('breadcrumbs navigation works', () => {
    });

    xit('download works', () => {
    });

    xit('sorting works', () => {
    });
});