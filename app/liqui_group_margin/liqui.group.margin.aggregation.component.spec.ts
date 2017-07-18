import {RouterModule} from '@angular/router';

import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {
    chceckSorting,
    compileTestBed,
    HttpAsyncServiceStub,
    stubRouter,
    TableBodyRow
} from '@dbg-riskit/dave-ui-testing';

import {AggregationPage, generateLiquiGroupMargin, generateLiquiGroupMarginHistory} from '@dave/testing';

import {CommonModule} from '@angular/common';
import {DataTableModule} from '@dbg-riskit/dave-ui-datatable';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {LiquiGroupMarginService} from './liqui.group.margin.service';
import {LiquiGroupMarginServerData} from './liqui.group.margin.types';

import {DATA_REFRESH_INTERVAL} from '../periodic.http.service';

import {LiquiGroupMarginAggregationComponent, valueGetters} from './liqui.group.margin.aggregation.component';
import {ROUTES} from '../routes/routing.paths';

xdescribe('Liqui Group Margin aggregation component', () => {
    let page: AggregationPage;

    compileTestBed(() => {
        TestBed.configureTestingModule({
            imports     : [
                CommonModule,
                DataTableModule,
                RouterModule
            ],
            declarations: [
                LiquiGroupMarginAggregationComponent
            ],
            providers   : [
                LiquiGroupMarginService,
                {
                    provide : HttpService,
                    useClass: HttpAsyncServiceStub
                }
            ]
        });
        return stubRouter().compileComponents();
    });

    beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>) => {
        // Generate test data
        http.returnValue(generateLiquiGroupMargin());
        // Create component
        page = new AggregationPage(TestBed.createComponent(LiquiGroupMarginAggregationComponent));
    })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadComponent).not
                .toBeNull('Initial load component visible.');
            expect(page.noDataComponent)
                .toBeNull('No data component not visible.');
            expect(page.updateFailedComponent)
                .toBeNull('Update failed component not visible.');
            expect(page.dataTable.element)
                .toBeNull('Data table not visible.');

            // Return error
            http.throwError({
                status : 500,
                message: 'Error message'
            });
            page.advanceHTTP();

            expect(page.initialLoadComponent)
                .toBeNull('Initial load component not visible.');
            expect(page.noDataComponent)
                .toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).not
                .toBeNull('Update failed component visible.');
            expect(page.dataTable.element)
                .toBeNull('Data table not visible.');
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadComponent).not
                .toBeNull('Initial load component visible.');
            expect(page.noDataComponent)
                .toBeNull('No data component not visible.');
            expect(page.updateFailedComponent)
                .toBeNull('Update failed component not visible.');
            expect(page.dataTable.element)
                .toBeNull('Data table not visible.');

            // Return no data
            http.popReturnValue(); // Remove from queue
            http.returnValue([]); // Push empty array
            page.advanceHTTP();

            expect(page.initialLoadComponent)
                .toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).not
                .toBeNull('No data component visible.');
            expect(page.updateFailedComponent)
                .toBeNull('Update failed component not visible.');
            expect(page.dataTable.element)
                .toBeNull('Data table not visible.');
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

        // Return data
        page.advanceHTTP();

        expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
        expect(page.noDataComponent).toBeNull('No data component not visible.');
        expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
        expect(page.dataTable.element).not.toBeNull('Data table visible.');

        // Fire highlighters
        page.advanceHighlighter();
    }));

    it('refresh data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>) => {
            // Init component
            page.detectChanges();
            // Return data
            page.advanceHTTP();

            expect(page.initialLoadComponent)
                .toBeNull('Initial load component not visible.');
            expect(page.noDataComponent)
                .toBeNull('No data component not visible.');
            expect(page.updateFailedComponent)
                .toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).not
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

            expect(page.dataTable.element).not
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

            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);
        })));

    it('can be sorted correctly', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Return data
        page.advanceHTTP();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);

        chceckSorting(page, [
            valueGetters.clearer, valueGetters.member, valueGetters.account,
            valueGetters.premiumMargin, valueGetters.currentLiquidatingMargin, valueGetters.additionalMargin,
            valueGetters.unadjustedMarginRequirement, valueGetters.variationPremiumPayment
        ]);

        // Fire highlighters
        page.advanceHighlighter();
    }));

    xdescribe('(after data are ready)', () => {
        beforeEach(fakeAsync(() => {
            // Init component
            page.detectChanges();
            // Return data
            page.advanceHTTP();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            // Fire highlighters
            page.advanceHighlighter();
        }));

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