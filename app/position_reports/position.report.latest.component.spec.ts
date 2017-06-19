import {ActivatedRoute} from '@angular/router';

import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {ActivatedRouteStub, chceckSorting, HttpAsyncServiceStub, TableBodyRow} from '@dbg-riskit/dave-ui-testing';

import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generatePositionReports, generatePositionReportsHistory, LatestListPage} from '../../testing';

import {PositionReportData, PositionReportServerData, PositionReportsParams} from './position.report.types';
import {PositionReportsService} from './position.reports.service';

import {DATA_REFRESH_INTERVAL} from '../abstract.component';

import {exportKeys, PositionReportLatestComponent, valueGetters} from './position.report.latest.component';
import {ROUTES} from '../routes/routing.paths';

xdescribe('Position reports latest component', () => {
    let page: LatestListPage<PositionReportLatestComponent>;

    beforeEach((done: DoneFn) => {
        LatestListPage.initTestBed(PositionReportLatestComponent, PositionReportsService)
            .then(done);
    });

    beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
        // Generate test data
        http.returnValue(generatePositionReports());
        // Create component
        page = new LatestListPage<PositionReportLatestComponent>(
            TestBed.createComponent(PositionReportLatestComponent));
    })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
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
        (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
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
        (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
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
            let newData = generatePositionReportsHistory();
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

    it('has correct pager',
        fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
            // Init component
            page.detectChanges();
            // Return data
            page.advanceHTTP();
            // Fire highlighters
            page.advanceHighlighter();

            expect(page.dataTable.pager.element).not.toBeNull('Pager visible');
            expect(page.dataTable.recordsCount.message).toContain('Showing 20 records out of ' + Math.pow(2, 10));

            page.dataTable.pager.expectButtonNumbers([1, 2, 3, 4]);
            page.dataTable.pager.expectButtonActive(2);
            page.dataTable.pager.expectLeadingButtonsDisabled();
            page.dataTable.pager.expectTrailingButtonsNotDisabled();

            page.dataTable.pager.click(4);

            page.dataTable.pager.expectButtonNumbers([1, 2, 3, 4, 5, 6]);
            page.dataTable.pager.expectButtonActive(4);
            page.dataTable.pager.expectLeadingButtonsNotDisabled();
            page.dataTable.pager.expectTrailingButtonsNotDisabled();

            http.returnValue(generatePositionReportsHistory());
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
        beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
            // Init component
            page.detectChanges();
            // Return data
            page.advanceHTTP();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            // Fire highlighters
            page.advanceHighlighter();
        })));

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
                page.dataTable.data.forEach((row: PositionReportData) => {
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

            page.dataTable.data.forEach((row: PositionReportData) => {
                expect(row.uid).toMatch('(' + idParts.join('|-') + '){' + idParts.length + '}');
            });

            // Remove highlight
            page.advanceHighlighter();
        }));

        it('has correct breadcrumbs navigation', fakeAsync(inject([ActivatedRoute],
            (activatedRoute: ActivatedRouteStub<PositionReportsParams>) => {
                let routeParams: string[] = [];

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('A');
                activatedRoute.testParams = {
                    clearer: routeParams[0]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('B');
                activatedRoute.testParams = {
                    clearer: routeParams[0],
                    member : routeParams[1]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('C');
                activatedRoute.testParams = {
                    clearer: routeParams[0],
                    member : routeParams[1],
                    account: routeParams[2]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('D');
                activatedRoute.testParams = {
                    clearer   : routeParams[0],
                    member    : routeParams[1],
                    account   : routeParams[2],
                    underlying: routeParams[3]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('E');
                activatedRoute.testParams = {
                    clearer         : routeParams[0],
                    member          : routeParams[1],
                    account         : routeParams[2],
                    underlying      : routeParams[3],
                    liquidationGroup: routeParams[4]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('F');
                activatedRoute.testParams = {
                    clearer              : routeParams[0],
                    member               : routeParams[1],
                    account              : routeParams[2],
                    underlying           : routeParams[3],
                    liquidationGroup     : routeParams[4],
                    liquidationGroupSplit: routeParams[5]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('G');
                activatedRoute.testParams = {
                    clearer              : routeParams[0],
                    member               : routeParams[1],
                    account              : routeParams[2],
                    underlying           : routeParams[3],
                    liquidationGroup     : routeParams[4],
                    liquidationGroupSplit: routeParams[5],
                    product              : routeParams[6]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('H');
                activatedRoute.testParams = {
                    clearer              : routeParams[0],
                    member               : routeParams[1],
                    account              : routeParams[2],
                    underlying           : routeParams[3],
                    liquidationGroup     : routeParams[4],
                    liquidationGroupSplit: routeParams[5],
                    product              : routeParams[6],
                    callPut              : routeParams[7]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('I');
                activatedRoute.testParams = {
                    clearer              : routeParams[0],
                    member               : routeParams[1],
                    account              : routeParams[2],
                    underlying           : routeParams[3],
                    liquidationGroup     : routeParams[4],
                    liquidationGroupSplit: routeParams[5],
                    product              : routeParams[6],
                    callPut              : routeParams[7],
                    contractYear         : routeParams[8]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('J');
                activatedRoute.testParams = {
                    clearer              : routeParams[0],
                    member               : routeParams[1],
                    account              : routeParams[2],
                    underlying           : routeParams[3],
                    liquidationGroup     : routeParams[4],
                    liquidationGroupSplit: routeParams[5],
                    product              : routeParams[6],
                    callPut              : routeParams[7],
                    contractYear         : routeParams[8],
                    contractMonth        : routeParams[9]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('K');
                activatedRoute.testParams = {
                    clearer              : routeParams[0],
                    member               : routeParams[1],
                    account              : routeParams[2],
                    underlying           : routeParams[3],
                    liquidationGroup     : routeParams[4],
                    liquidationGroupSplit: routeParams[5],
                    product              : routeParams[6],
                    callPut              : routeParams[7],
                    contractYear         : routeParams[8],
                    contractMonth        : routeParams[9],
                    expiryDay            : routeParams[10]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('L');
                activatedRoute.testParams = {
                    clearer              : routeParams[0],
                    member               : routeParams[1],
                    account              : routeParams[2],
                    underlying           : routeParams[3],
                    liquidationGroup     : routeParams[4],
                    liquidationGroupSplit: routeParams[5],
                    product              : routeParams[6],
                    callPut              : routeParams[7],
                    contractYear         : routeParams[8],
                    contractMonth        : routeParams[9],
                    expiryDay            : routeParams[10],
                    exercisePrice        : routeParams[11]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('M');
                activatedRoute.testParams = {
                    clearer              : routeParams[0],
                    member               : routeParams[1],
                    account              : routeParams[2],
                    underlying           : routeParams[3],
                    liquidationGroup     : routeParams[4],
                    liquidationGroupSplit: routeParams[5],
                    product              : routeParams[6],
                    callPut              : routeParams[7],
                    contractYear         : routeParams[8],
                    contractMonth        : routeParams[9],
                    expiryDay            : routeParams[10],
                    exercisePrice        : routeParams[11],
                    version              : routeParams[12]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');

                routeParams.push('N');
                activatedRoute.testParams = {
                    clearer              : routeParams[0],
                    member               : routeParams[1],
                    account              : routeParams[2],
                    underlying           : routeParams[3],
                    liquidationGroup     : routeParams[4],
                    liquidationGroupSplit: routeParams[5],
                    product              : routeParams[6],
                    callPut              : routeParams[7],
                    contractYear         : routeParams[8],
                    contractMonth        : routeParams[9],
                    expiryDay            : routeParams[10],
                    exercisePrice        : routeParams[11],
                    version              : routeParams[12],
                    flexContractSymbol   : routeParams[13]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.POSITION_REPORTS_LATEST,
                    'Latest Position Reports');
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
            expect(exportedData.split('\n').length).toBe(Math.pow(2, 10) + 2);
        }));

        it('can be sorted correctly', fakeAsync(() => {
            chceckSorting(page, [
                valueGetters.member, valueGetters.account, valueGetters.product,
                valueGetters.callPut, valueGetters.contractYear, valueGetters.contractMonth,
                valueGetters.expiryDay, valueGetters.exercisePrice, valueGetters.version, valueGetters.netQuantityLs,
                valueGetters.compVar, valueGetters.normalizedDelta, valueGetters.compLiquidityAddOn
            ]);

            // Fire highlighters
            page.advanceHighlighter();
        }));
    });
});