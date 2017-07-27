import {RouterModule} from '@angular/router';

import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {
    AuthServiceStub,
    chceckSorting,
    compileTestBed,
    disableMaterialAnimations,
    HttpAsyncServiceStub,
    stubRouter,
    TableBodyRow
} from '@dbg-riskit/dave-ui-testing';

import {AggregationPage, generateLiquiGroupMargin, generateLiquiGroupMarginHistory} from '@dave/testing';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {DataTableModule} from '@dbg-riskit/dave-ui-datatable';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';
import {HttpService} from '@dbg-riskit/dave-ui-http';
import {NoopAnimationsCommonViewModule} from '@dbg-riskit/dave-ui-view';

import {LiquiGroupMarginService} from './liqui.group.margin.service';
import {LiquiGroupMarginServerData} from './liqui.group.margin.types';

import {DATA_REFRESH_INTERVAL, PeriodicHttpService} from '../periodic.http.service';
import {DrillDownRowButtonComponent} from '../list/drill.down.row.button.component';

import {LiquiGroupMarginAggregationComponent, valueGetters} from './liqui.group.margin.aggregation.component';
import {ROUTES} from '../routes/routing.paths';

describe('Liqui Group Margin aggregation component', () => {
    let page: AggregationPage;

    compileTestBed(() => {
        TestBed.configureTestingModule({
            imports     : [
                NoopAnimationsCommonViewModule,
                DataTableModule,
                RouterModule
            ],
            declarations: [
                LiquiGroupMarginAggregationComponent,
                DrillDownRowButtonComponent
            ],
            providers   : [
                LiquiGroupMarginService,
                {
                    provide : HttpService,
                    useClass: HttpAsyncServiceStub
                },
                {
                    provide : AuthService,
                    useClass: AuthServiceStub
                },
                PeriodicHttpService,
                ErrorCollectorService
            ]
        });
        disableMaterialAnimations(DataTableModule);
        return stubRouter().compileComponents();
    }, () => {
        page = null;
    });

    beforeEach(fakeAsync(inject([HttpService, LiquiGroupMarginService],
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>, service: LiquiGroupMarginService) => {
            // Generate test data
            http.returnValue(generateLiquiGroupMargin());
            // Create component
            page = new AggregationPage(TestBed.createComponent(LiquiGroupMarginAggregationComponent));

            //We have to detach the timer and reatach it later in test to be in correct Zone
            // noinspection JSDeprecatedSymbols
            service.destroyPeriodicTimer();
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService, LiquiGroupMarginService],
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>, service: LiquiGroupMarginService) => {
            // Attach the timer
            service.setupPeriodicTimer();

            // Init component
            page.detectChanges();

            expect(page.initialLoadComponent).not
                .toBeNull('Initial load component visible.');
            expect(page.noDataComponent)
                .toBeNull('No data component not visible.');
            expect(page.dataTable.debugElement)
                .toBeNull('Data table not visible.');

            // Return no data
            http.popReturnValue(); // Remove from queue
            http.returnValue([]); // Push empty array
            page.advanceHTTP();

            expect(page.initialLoadComponent)
                .toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).not
                .toBeNull('No data component visible.');
            expect(page.dataTable.debugElement)
                .toBeNull('Data table not visible.');

            // Discard the service timer
            // noinspection JSDeprecatedSymbols
            service.destroyPeriodicTimer();
        })));

    it('displays data table', fakeAsync(inject([LiquiGroupMarginService],
        (service: LiquiGroupMarginService) => {
            // Attach the timer
            service.setupPeriodicTimer();

            // Init component
            page.detectChanges();

            expect(page.initialLoadComponent).not.toBeNull('Initial load component visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.dataTable.debugElement).toBeNull('Data table not visible.');

            // Return data
            page.advanceHTTP();

            expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.dataTable.debugElement).not.toBeNull('Data table visible.');

            // Fire highlighters
            page.advanceHighlighter();

            // Discard the service timer
            // noinspection JSDeprecatedSymbols
            service.destroyPeriodicTimer();
        })));

    it('refresh data correctly', fakeAsync(inject([HttpService, LiquiGroupMarginService],
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>, service: LiquiGroupMarginService) => {
            // Attach the timer
            service.setupPeriodicTimer();

            // Init component
            page.detectChanges();
            // Return data
            page.advanceHTTP();

            expect(page.initialLoadComponent)
                .toBeNull('Initial load component not visible.');
            expect(page.noDataComponent)
                .toBeNull('No data component not visible.');
            expect(page.dataTable.debugElement).not
                .toBeNull('Data table visible.');

            expect(page.dataTable.body.rows.every((row: TableBodyRow) => {
                return row.highlighted;
            })).toBeTruthy('All rows are highlighted');

            // Fire highlighters
            page.advanceHighlighter();

            expect(page.dataTable.body.rows.every((row: TableBodyRow) => {
                return !row.highlighted;
            })).toBeTruthy('No rows are highlighted');

            // Push new data
            let newData = generateLiquiGroupMarginHistory();
            http.returnValue(newData);
            // Trigger reload
            page.advanceAndDetectChangesUsingOffset(DATA_REFRESH_INTERVAL);
            page.advanceHTTP();

            expect(page.dataTable.debugElement).not
                .toBeNull('Data table visible.');

            expect(page.dataTable.body.rows.every((row: TableBodyRow) => {
                return row.highlighted;
            })).toBeTruthy('All rows are highlighted');

            // Fire highlighters
            page.advanceHighlighter();

            expect(page.dataTable.body.rows.every((row: TableBodyRow) => {
                return !row.highlighted;
            })).toBeTruthy('No rows are highlighted');

            // Return the same data
            http.returnValue(newData);
            // Trigger reload
            page.advanceAndDetectChangesUsingOffset(DATA_REFRESH_INTERVAL);
            page.advanceHTTP();

            expect(page.dataTable.body.rows.every((row: TableBodyRow) => {
                return !row.highlighted;
            })).toBeTruthy('No rows are highlighted');

            // Discard the service timer
            // noinspection JSDeprecatedSymbols
            service.destroyPeriodicTimer();
        })));

    it('can be sorted correctly', fakeAsync(inject([LiquiGroupMarginService],
        (service: LiquiGroupMarginService) => {
            // Attach the timer
            service.setupPeriodicTimer();

            // Init component
            page.detectChanges();
            // Return data
            page.advanceHTTP();

            chceckSorting(page, [
                valueGetters.clearer, valueGetters.member, valueGetters.account,
                valueGetters.premiumMargin, valueGetters.currentLiquidatingMargin, valueGetters.additionalMargin,
                valueGetters.unadjustedMarginRequirement, valueGetters.variationPremiumPayment
            ]);

            // Fire highlighters
            page.advanceHighlighter();

            // Discard the service timer
            // noinspection JSDeprecatedSymbols
            service.destroyPeriodicTimer();
        })));

    describe('(after data are ready)', () => {
        beforeEach(fakeAsync(inject([LiquiGroupMarginService],
            (service: LiquiGroupMarginService) => {
                // Attach the timer
                service.setupPeriodicTimer();

                // Init component
                page.detectChanges();
                // Return data
                page.advanceHTTP();

                // Discard the service timer
                // noinspection JSDeprecatedSymbols
                service.destroyPeriodicTimer();

                // Fire highlighters
                page.advanceHighlighter();
            })));

        xit('displays data correctly', fakeAsync(() => {
        }));

        xit('has correct row navigation', fakeAsync(() => {
        }));

        xit('displays correct data in the footer', fakeAsync(() => {
        }));

        it('has pager disabled', fakeAsync(() => {
            expect(page.dataTable.pager.element).toBeNull('Pager not visible');
        }));

        it('navigates using "View Details" correctly', fakeAsync(() => {
            let clickSpy = spyOn(page.link.stub, 'onClick').and.callThrough();
            page.link.click();

            expect(clickSpy).toHaveBeenCalled();
            expect(page.link.stub.navigatedTo).toContain(ROUTES.LIQUI_GROUP_MARGIN_LATEST);
        }));
    });
});