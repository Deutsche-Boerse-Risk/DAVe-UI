import {ActivatedRoute} from '@angular/router';

import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {
    ActivatedRouteStub,
    chceckSorting,
    compileTestBed,
    HttpAsyncServiceStub,
    TableBodyRow
} from '@dbg-riskit/dave-ui-testing';

import {ErrorType} from '@dbg-riskit/dave-ui-common';
import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generateAccountMargin, generateAccountMarginHistory, LatestListPage} from '@dave/testing';

import {AccountMarginData, AccountMarginParams, AccountMarginServerData} from './account.margin.types';
import {AccountMarginService} from './account.margin.service';

import {DATA_REFRESH_INTERVAL} from '../periodic.http.service';

import {AccountMarginLatestComponent, exportKeys, valueGetters} from './account.margin.latest.component';
import {ROUTES} from '../routes/routing.paths';

xdescribe('Account margin latest component', () => {
    let page: LatestListPage<AccountMarginLatestComponent>;

    compileTestBed(() => {
        return LatestListPage.initTestBed(AccountMarginLatestComponent, AccountMarginService);
    });

    beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<AccountMarginServerData[]>) => {
        // Generate test data
        http.returnValue(generateAccountMargin());
        // Create component
        page = new LatestListPage<AccountMarginLatestComponent>(
            TestBed.createComponent(AccountMarginLatestComponent));
    })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<AccountMarginServerData[]>) => {
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
                status   : 500,
                message  : 'Error message',
                errorType: ErrorType.REQUEST
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
        (http: HttpAsyncServiceStub<AccountMarginServerData[]>) => {
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
        (http: HttpAsyncServiceStub<AccountMarginServerData[]>) => {
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
            let newData = generateAccountMarginHistory();
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

    it('has correct pager', fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<AccountMarginServerData[]>) => {
        // Generate more rows
        http.popReturnValue();
        http.returnValue(generateAccountMargin(3, 3, 3, 3));

        // Init component
        page.detectChanges();
        // Return data
        page.advanceHTTP();
        // Fire highlighters
        page.advanceHighlighter();

        expect(page.dataTable.pager.element).not.toBeNull('Pager visible');
        expect(page.dataTable.recordsCount.message).toContain('Showing 20 records out of ' + Math.pow(3, 4));

        page.dataTable.pager.expectButtonNumbers([1, 2, 3, 4]);
        page.dataTable.pager.expectButtonActive(2);
        page.dataTable.pager.expectLeadingButtonsDisabled();
        page.dataTable.pager.expectTrailingButtonsNotDisabled();

        page.dataTable.pager.click(4);

        page.dataTable.pager.expectButtonNumbers([1, 2, 3, 4, 5]);
        page.dataTable.pager.expectButtonActive(4);
        page.dataTable.pager.expectLeadingButtonsNotDisabled();
        page.dataTable.pager.expectTrailingButtonsNotDisabled();

        http.returnValue(generateAccountMarginHistory());
        // Trigger reload
        page.advanceAndDetectChangesUsingOffset(DATA_REFRESH_INTERVAL);
        page.advanceHTTP();

        expect(page.dataTable.pager.element).toBeNull('Pager not visible');
        expect(page.dataTable.recordsCount.message).toContain('Showing 16 records out of 16');

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

        it('has filtering working', fakeAsync(() => {
            let firstRow = page.dataTable.data[0];
            let originalItems = page.dataTable.data.length;
            let items = originalItems;
            let filter = '';
            let idParts = firstRow.uid.split('-');
            for (let id of idParts) {
                filter += id + '-';
                page.filter(filter);
                expect(items >= page.dataTable.data.length).toBeTruthy();
                items = page.dataTable.data.length;
                page.dataTable.data.forEach((row: AccountMarginData) => {
                    expect(row.uid).toMatch('^' + filter);
                });
                if (items === 1) {
                    break;
                }
            }

            // Clear the field
            page.filter('');

            expect(page.dataTable.data.length).toBe(originalItems);

            filter = idParts.join('- -');
            page.filter(filter);

            page.dataTable.data.forEach((row: AccountMarginData) => {
                expect(row.uid).toMatch('(' + idParts.join('|-') + '){' + idParts.length + '}');
            });

            // Remove highlight
            page.advanceHighlighter();
        }));

        it('has correct breadcrumbs navigation', fakeAsync(inject([ActivatedRoute],
            (activatedRoute: ActivatedRouteStub<AccountMarginParams>) => {
                let routeParams: string[] = [];

                page.checkBreadCrumbs(routeParams,
                    ROUTES.ACCOUNT_MARGIN_LATEST,
                    'Latest Account Margin');

                routeParams.push('A');
                activatedRoute.testParams = {
                    clearer: routeParams[0]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.ACCOUNT_MARGIN_LATEST,
                    'Latest Account Margin');

                routeParams.push('B');
                activatedRoute.testParams = {
                    clearer: routeParams[0],
                    member : routeParams[1]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.ACCOUNT_MARGIN_LATEST,
                    'Latest Account Margin');

                routeParams.push('C');
                activatedRoute.testParams = {
                    clearer: routeParams[0],
                    member : routeParams[1],
                    account: routeParams[2]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.ACCOUNT_MARGIN_LATEST,
                    'Latest Account Margin');

                routeParams.push('D');
                activatedRoute.testParams = {
                    clearer       : routeParams[0],
                    member        : routeParams[1],
                    account       : routeParams[2],
                    marginCurrency: routeParams[3]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.ACCOUNT_MARGIN_LATEST,
                    'Latest Account Margin');
            })));

        xit('has correct row navigation', fakeAsync(() => {
        }));

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
            expect(exportedData.split('\n').length).toBe(Math.pow(2, 4) + 2);
        }));

        it('can be sorted correctly', fakeAsync(() => {
            chceckSorting(page, [
                valueGetters.member,
                valueGetters.account,
                valueGetters.marginCurrency,
                valueGetters.pool,
                valueGetters.marginReqInMarginCurr,
                valueGetters.marginReqInClrCurr,
                valueGetters.unadjustedMarginRequirement,
                valueGetters.variationPremiumPayment
            ]);

            // Fire highlighters
            page.advanceHighlighter();
        }));
    });
});