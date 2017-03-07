import {LocationStrategy} from "@angular/common";
import {Router, ActivatedRoute} from "@angular/router";

import {async, TestBed, fakeAsync, inject, tick} from "@angular/core/testing";

import {RouterStub, LocationStrategyStub} from "../../testing/router.stub";
import {ActivatedRouteStub} from "../../testing/activated.route.stub";
import {LatestListPage} from "../../testing/list.page";
import {RouterLinkStubDirective} from "../../testing/router.link.stub";
import {HttpAsyncServiceStub} from "../../testing/http.service.stub";
import {generatePositionReports} from "../../testing/mock/position.reports.generator";
import {advance} from "../../testing/index";

import {PositionReportServerData} from "./position.report.types";
import {PositionReportsService} from "./position.reports.service";
import {HttpService} from "../http.service";

import {PositionReportLatestComponent} from "./position.report.latest.component";
import {ListModule} from "../list/list.module";
import {DataTableModule} from "../datatable/data.table.module";

describe('Position reports latest component', () => {
    let page: LatestListPage<PositionReportLatestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ListModule,
                DataTableModule
            ],
            declarations: [
                PositionReportLatestComponent,
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
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
        // Generate test data
        http.returnValue(generatePositionReports());
        // Create component
        page = new LatestListPage<PositionReportLatestComponent>(TestBed.createComponent(PositionReportLatestComponent));
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
            expect(page.dataTable.tableElement).toBeNull('Data table not visible.');

            // Return error
            http.throwError({
                status: 500,
                message: 'Error message'
            });
            advance(page.fixture, 1000);
            tick();

            expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).not.toBeNull('Update failed component visible.');
            expect(page.dataTable.tableElement).toBeNull('Data table not visible.');
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
            expect(page.dataTable.tableElement).toBeNull('Data table not visible.');

            // Return no data
            http.popReturnValue(); // Remove from queue
            http.returnValue([]); // Push empty array
            advance(page.fixture, 1000);
            tick();

            expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).not.toBeNull('No data component visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.tableElement).toBeNull('Data table not visible.');
        })));

    it('displays data table', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);

        expect(page.initialLoadComponent).not.toBeNull('Initial load component visible.');
        expect(page.noDataComponent).toBeNull('No data component not visible.');
        expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
        expect(page.dataTable.tableElement).toBeNull('Data table not visible.');

        // Return data
        advance(page.fixture, 1000);
        tick();

        expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
        expect(page.noDataComponent).toBeNull('No data component not visible.');
        expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
        expect(page.dataTable.tableElement).not.toBeNull('Data table visible.');

        // Fire highlighters
        tick(15000);
    }));
});