import {ActivatedRoute} from '@angular/router';

import {discardPeriodicTasks, fakeAsync, inject, TestBed} from '@angular/core/testing';

import {
    ActivatedRouteStub,
    chceckSorting,
    compileTestBed,
    HttpAsyncServiceStub,
    TableBodyRow
} from '@dbg-riskit/dave-ui-testing';

import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generateLiquiGroupMarginHistory, HistoryListPage} from '@dave/testing';

import {LiquiGroupMarginHistoryParams, LiquiGroupMarginServerData} from './liqui.group.margin.types';
import {LiquiGroupMarginService} from './liqui.group.margin.service';

import {DATA_REFRESH_INTERVAL} from '../periodic.http.service';

import {exportKeys, valueGetters} from './liqui.group.margin.latest.component';
import {LiquiGroupMarginHistoryComponent} from './liqui.group.margin.history.component';
import {ROUTES} from '../routes/routing.paths';

describe('Liquidation Group Margin history component', () => {
    let page: HistoryListPage<LiquiGroupMarginHistoryComponent>;
    let testingParams = ['A', 'A', 'B', 'C', '*'];

    compileTestBed(() => {
        return HistoryListPage.initTestBed(LiquiGroupMarginHistoryComponent, LiquiGroupMarginService);
    }, fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<any>) => {
            // Generate test data
            http.returnValue([]);
            // Push empty array
            page.advanceHTTP();
            page.destroy();
            page = null;
        })));

    beforeEach(fakeAsync(inject([HttpService, ActivatedRoute],
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>,
            activatedRoute: ActivatedRouteStub<LiquiGroupMarginHistoryParams>) => {
            // Generate test data
            http.returnValue(generateLiquiGroupMarginHistory());

            // Set input parameters
            activatedRoute.testParams = {
                clearer       : testingParams[0],
                member        : testingParams[1],
                account       : testingParams[2],
                marginClass   : testingParams[3],
                marginCurrency: testingParams[4]
            };

            // Create component
            page = new HistoryListPage<LiquiGroupMarginHistoryComponent>(
                TestBed.createComponent(LiquiGroupMarginHistoryComponent));

            // Remove timer for latest data
            page.disablePeriodicTimer(LiquiGroupMarginService);

            // Remove timer for history data
            discardPeriodicTasks();
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>) => {
            // Init component
            page.detectChanges();

            expect(page.initialLoadComponent).not
                .toBeNull('Initial load component visible.');
            expect(page.noDataComponent)
                .toBeNull('No data component not visible.');
            expect(page.dataTable.element)
                .toBeNull('Data table not visible.');
            expect(page.lineChart).toBeNull('Chart not visible.');

            // Return no data
            http.popReturnValue(); // Remove from queue
            http.returnValue([]); // Push empty array
            page.advanceHTTP();

            expect(page.initialLoadComponent)
                .toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).not
                .toBeNull('No data component visible.');
            expect(page.dataTable.element)
                .toBeNull('Data table not visible.');
            expect(page.lineChart).toBeNull('Chart not visible.');

            // Remove timer for history data
            discardPeriodicTasks();
        })));

    it('displays data table', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>) => {
            let httpSpy = spyOn(http, 'get').and.callThrough();
            // Init component
            page.detectChanges();

            expect(page.initialLoadComponent).not
                .toBeNull('Initial load component visible.');
            expect(page.noDataComponent)
                .toBeNull('No data component not visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');
            expect(page.lineChart).toBeNull('Chart not visible.');

            // Return data
            page.advanceHTTP();

            expect(httpSpy).toHaveBeenCalled();
            expect(httpSpy.calls.mostRecent().args[0].params).toEqual({
                clearer       : testingParams[0],
                member        : testingParams[1],
                account       : testingParams[2],
                marginClass   : testingParams[3],
                marginCurrency: testingParams[4]
            });

            expect(page.initialLoadComponent)
                .toBeNull('Initial load component not visible.');
            expect(page.noDataComponent)
                .toBeNull('No data component not visible.');
            expect(page.dataTable.element).not.toBeNull('Data table visible.');
            expect(page.lineChart).not.toBeNull('Chart visible.');

            // Fire highlighters
            page.advanceHighlighter();

            // Remove timer for history data
            discardPeriodicTasks();
        })));

    it('data correctly refreshed', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>) => {
            // Init component
            page.detectChanges();
            // Return data
            page.advanceHTTP();

            expect(page.initialLoadComponent)
                .toBeNull('Initial load component not visible.');
            expect(page.noDataComponent)
                .toBeNull('No data component not visible.');
            expect(page.dataTable.element).not
                .toBeNull('Data table visible.');
            expect(page.lineChart).not.toBeNull('Chart visible.');

            expect(page.dataTable.body.rows.every((row: TableBodyRow) => {
                return row.highlighted;
            })).toBeTruthy('All rows are highlighted');

            // Fire highlighters
            page.advanceHighlighter();

            expect(page.dataTable.body.rows.every((row: TableBodyRow) => {
                return !row.highlighted;
            })).toBeTruthy('No rows are highlighted');

            // Push new data
            let newData = generateLiquiGroupMarginHistory(50);
            http.returnValue(newData);
            // Trigger reload
            page.advanceAndDetectChangesUsingOffset(DATA_REFRESH_INTERVAL);
            page.advanceHTTP();

            expect(page.dataTable.element).not
                .toBeNull('Data table visible.');
            expect(page.lineChart).not.toBeNull('Chart visible.');

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

            // Remove timer for history data
            discardPeriodicTasks();
        })));

    it('has correct pager',
        fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>) => {
            // Init component
            page.detectChanges();
            // Return data
            page.advanceHTTP();
            // Fire highlighters
            page.advanceHighlighter();

            expect(page.dataTable.pager.element).toBeNull('Pager not visible');
            expect(page.dataTable.recordsCount.message).toContain('Showing 16 records out of 16');

            let newData = generateLiquiGroupMarginHistory()
                .concat(generateLiquiGroupMarginHistory())
                .concat(generateLiquiGroupMarginHistory());
            http.returnValue(newData);
            // Trigger reload
            page.advanceAndDetectChangesUsingOffset(DATA_REFRESH_INTERVAL);
            page.advanceHTTP();
            page.detectChanges();

            expect(page.dataTable.pager.element).not.toBeNull('Pager visible');
            expect(page.dataTable.recordsCount.message).toContain('Showing 20 records out of ' + 3 * 16);

            page.dataTable.pager.expectButtonNumbers([1, 2, 3]);
            page.dataTable.pager.expectButtonActive(2);
            page.dataTable.pager.expectLeadingButtonsDisabled();
            page.dataTable.pager.expectTrailingButtonsNotDisabled();

            page.dataTable.pager.click(4);

            page.dataTable.pager.expectButtonNumbers([1, 2, 3]);
            page.dataTable.pager.expectButtonActive(4);
            page.dataTable.pager.expectLeadingButtonsNotDisabled();
            page.dataTable.pager.expectTrailingButtonsDisabled();

            // Fire highlighters
            page.advanceHighlighter();

            // Remove timer for history data
            discardPeriodicTasks();
        })));

    describe('(after data are ready)', () => {
        beforeEach(fakeAsync(() => {
            // Init component
            page.detectChanges();
            // Return data
            page.advanceHTTP();

            // Fire highlighters
            page.advanceHighlighter();

            // Remove timer for history data
            discardPeriodicTasks();
        }));

        xit('displays data correctly', fakeAsync(() => {
        }));

        xit('has chart data correctly processed', fakeAsync(() => {
        }));

        it('has correct breadcrumbs navigation', fakeAsync(inject([ActivatedRoute],
            (activatedRoute: ActivatedRouteStub<LiquiGroupMarginHistoryParams>) => {
                page.checkBreadCrumbs(testingParams,
                    ROUTES.LIQUI_GROUP_MARGIN_LATEST,
                    'Liquidation Group Margin History',
                    false, 1);

                let routeParams = ['A', 'A', 'B', 'C', 'D'];

                activatedRoute.testParams = {
                    clearer       : routeParams[0],
                    member        : routeParams[1],
                    account       : routeParams[2],
                    marginClass   : routeParams[3],
                    marginCurrency: routeParams[4]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.LIQUI_GROUP_MARGIN_LATEST,
                    'Liquidation Group Margin History',
                    false, 1);
            })));

        it('has download working', fakeAsync(() => {
            let downloadLink = page.downloadMenu;
            downloadLink.click();

            expect(downloadLink.saveSpy).toHaveBeenCalled();
            expect(downloadLink.blobSpy).toHaveBeenCalled();
            let exportedData = downloadLink.blobSpy.calls.mostRecent().args[0][0];
            expect(exportedData).not.toBeNull();
            expect(exportedData.split('\n')[0]).toEqual(exportKeys.map(
                (key: CSVExportColumn<any>) => key.header).join(','));
            let data = page.dataTable.data;
            expect(exportedData.split('\n')[1]).toContain(exportKeys.slice(0, exportKeys.length - 1).map(
                (key: CSVExportColumn<any>) => key.get(data[0]) ? key.get(data[0]).toString() : '')
                .join(','));
            let cells = exportedData.split('\n')[1].split(',');
            expect(cells[cells.length - 1])
                .toMatch(/^\d{2}\. \d{2}\. \d{4} \d{2}:\d{2}:\d{2}$/);
            expect(exportedData.split('\n').length).toBe(18);
        }));

        it('can be sorted correctly', fakeAsync(() => {
            chceckSorting(page, [
                valueGetters.received,
                valueGetters.premiumMargin,
                valueGetters.currentLiquidatingMargin,
                valueGetters.additionalMargin,
                valueGetters.unadjustedMarginRequirement,
                valueGetters.variationPremiumPayment
            ]);
        }));
    });
});