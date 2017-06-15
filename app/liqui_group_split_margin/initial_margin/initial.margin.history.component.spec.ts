import {ActivatedRoute} from '@angular/router';

import {async, fakeAsync, inject, TestBed} from '@angular/core/testing';

import {ActivatedRouteStub, chceckSorting, HttpAsyncServiceStub, TableBodyRow} from '@dbg-riskit/dave-ui-testing';

import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generateLiquiGroupSplitMarginHistory, HistoryListPage} from '../../../testing';

import {LiquiGroupSplitMarginHistoryParams, LiquiGroupSplitMarginServerData} from '../liqui.group.split.margin.types';
import {LiquiGroupSplitMarginService} from '../liqui.group.split.margin.service';

import {DATA_REFRESH_INTERVAL} from '../../abstract.component';

import {exportKeys, valueGetters} from './initial.margin.latest.component';
import {InitialMarginHistoryComponent} from './initial.margin.history.component';
import {ROUTES} from '../../routes/routing.paths';

xdescribe('Initial Margin history component', () => {
    let page: HistoryListPage<InitialMarginHistoryComponent>;
    let testingParams = ['A', 'A', 'B', 'C', '*', 'D'];

    beforeEach(async(() => {
        HistoryListPage.initTestBed(InitialMarginHistoryComponent, LiquiGroupSplitMarginService);
    }));

    beforeEach(fakeAsync(inject([HttpService, ActivatedRoute],
        (http: HttpAsyncServiceStub<LiquiGroupSplitMarginServerData[]>,
            activatedRoute: ActivatedRouteStub<LiquiGroupSplitMarginHistoryParams>) => {
            // Generate test data
            http.returnValue(generateLiquiGroupSplitMarginHistory());

            // Set input parameters
            activatedRoute.testParams = {
                clearer              : testingParams[0],
                member               : testingParams[1],
                account              : testingParams[2],
                liquidationGroup     : testingParams[3],
                liquidationGroupSplit: testingParams[4],
                marginCurrency       : testingParams[5]
            };

            // Create component
            page = new HistoryListPage<InitialMarginHistoryComponent>(
                TestBed.createComponent(InitialMarginHistoryComponent));
        })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<LiquiGroupSplitMarginServerData[]>) => {
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
            expect(page.lineChart).toBeNull('Chart not visible.');

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
            expect(page.lineChart).toBeNull('Chart not visible.');
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<LiquiGroupSplitMarginServerData[]>) => {
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
            expect(page.lineChart).toBeNull('Chart not visible.');

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
            expect(page.lineChart).toBeNull('Chart not visible.');
        })));

    it('displays data table', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<LiquiGroupSplitMarginServerData[]>) => {
            let httpSpy = spyOn(http, 'get').and.callThrough();
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
            expect(page.dataTable.element).toBeNull('Data table not visible.');
            expect(page.lineChart).toBeNull('Chart not visible.');

            // Return data
            page.advanceHTTP();

            expect(httpSpy).toHaveBeenCalled();
            expect(httpSpy.calls.mostRecent().args[0].params).toEqual({
                clearer              : testingParams[0],
                member               : testingParams[1],
                account              : testingParams[2],
                liquidationGroup     : testingParams[3],
                liquidationGroupSplit: testingParams[4],
                marginCurrency       : testingParams[5]
            });

            expect(page.initialLoadComponent)
                .toBeNull('Initial load component not visible.');
            expect(page.noDataComponent)
                .toBeNull('No data component not visible.');
            expect(page.updateFailedComponent)
                .toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).not.toBeNull('Data table visible.');
            expect(page.lineChart).not.toBeNull('Chart visible.');

            // Fire highlighters
            page.advanceHighlighter();
        })));

    it('data correctly refreshed', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<LiquiGroupSplitMarginServerData[]>) => {
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
            let newData = generateLiquiGroupSplitMarginHistory(50);
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

            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);
        })));

    it('has correct pager',
        fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<LiquiGroupSplitMarginServerData[]>) => {
            // Init component
            page.detectChanges();
            // Return data
            page.advanceHTTP();
            // Fire highlighters
            page.advanceHighlighter();

            expect(page.dataTable.pager.element).toBeNull('Pager not visible');
            expect(page.dataTable.recordsCount.message).toContain('Showing 16 records out of 16');

            let newData = generateLiquiGroupSplitMarginHistory()
                .concat(generateLiquiGroupSplitMarginHistory())
                .concat(generateLiquiGroupSplitMarginHistory());
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
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);
        })));

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

        xit('has chart data correctly processed', fakeAsync(() => {
        }));

        it('has correct breadcrumbs navigation', fakeAsync(inject([ActivatedRoute],
            (activatedRoute: ActivatedRouteStub<LiquiGroupSplitMarginHistoryParams>) => {
                page.checkBreadCrumbs(testingParams,
                    ROUTES.INITIAL_MARGIN_LATEST,
                    'Initial Margin History',
                    false, 2);

                let routeParams = ['A', 'A', 'B', 'C', 'D', 'E'];

                activatedRoute.testParams = {
                    clearer              : routeParams[0],
                    member               : routeParams[1],
                    account              : routeParams[2],
                    liquidationGroup     : routeParams[3],
                    liquidationGroupSplit: routeParams[4],
                    marginCurrency       : routeParams[5]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.INITIAL_MARGIN_LATEST,
                    'Initial Margin History',
                    false, 2);
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
            expect(exportedData.split('\n')[1]).toContain(exportKeys.slice(0, exportKeys.length - 1).map(
                (key: CSVExportColumn<any>) =>
                    key.get(page.dataTable.data[0]) ? key.get(page.dataTable.data[0]).toString() : '')
                .join(','));
            let cells = exportedData.split('\n')[1].split(',');
            expect(cells[cells.length - 1])
                .toMatch(/^\d{2}\. \d{2}\. \d{4} \d{2}:\d{2}:\d{2}$/);
            expect(exportedData.split('\n').length).toBe(18);
        }));

        it('can be sorted correctly', fakeAsync(() => {
            chceckSorting(page, [
                valueGetters.received,
                valueGetters.marketRisk,
                valueGetters.liquRisk,
                valueGetters.longOptionCredit,
                valueGetters.additionalMargin
            ]);
        }));
    });
});