import {ActivatedRoute} from '@angular/router';

import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {
    ActivatedRouteStub,
    chceckSorting,
    compileTestBed,
    HttpAsyncServiceStub,
    TableBodyRow
} from '@dbg-riskit/dave-ui-testing';

import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generateRiskLimitUtilization, generateRiskLimitUtilizationHistory, LatestListPage} from '@dave/testing';

import {
    RiskLimitUtilizationData,
    RiskLimitUtilizationParams,
    RiskLimitUtilizationServerData
} from './risk.limit.utilization.types';
import {RiskLimitUtilizationService} from './risk.limit.utilization.service';

import {DATA_REFRESH_INTERVAL} from '../periodic.http.service';

import {exportKeys, RiskLimitUtilizationLatestComponent, valueGetters} from './risk.limit.utilization.latest.component';
import {ROUTES} from '../routes/routing.paths';

describe('Risk limit utilization latest component', () => {
    let page: LatestListPage<RiskLimitUtilizationLatestComponent>;

    compileTestBed(() => {
        return LatestListPage.initTestBed(RiskLimitUtilizationLatestComponent, RiskLimitUtilizationService);
    }, fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<any>) => {
            // Generate test data
            http.returnValue([]);
            // Push empty array
            page.advanceHTTP();
            page = null;
        })));

    beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<RiskLimitUtilizationServerData[]>) => {
        // Generate test data
        http.returnValue(generateRiskLimitUtilization());
        // Create component
        page = new LatestListPage<RiskLimitUtilizationLatestComponent>(
            TestBed.createComponent(RiskLimitUtilizationLatestComponent));

        // We have to detach the timer and reatach it later in test to be in correct Zone
        page.disablePeriodicTimer(RiskLimitUtilizationService);
    })));

    it('displays no-data correctly', fakeAsync(inject([HttpService, RiskLimitUtilizationService],
        (http: HttpAsyncServiceStub<RiskLimitUtilizationServerData[]>, service: RiskLimitUtilizationService) => {
            // Attach the timer
            service.setupPeriodicTimer();

            // Init component
            page.detectChanges();

            expect(page.initialLoadComponent).not
                .toBeNull('Initial load component visible.');
            expect(page.noDataComponent)
                .toBeNull('No data component not visible.');
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
            expect(page.dataTable.element)
                .toBeNull('Data table not visible.');

            // Discard the service timer
            page.disablePeriodicTimer(RiskLimitUtilizationService);
        })));

    it('displays data table', fakeAsync(inject([RiskLimitUtilizationService],
        (service: RiskLimitUtilizationService) => {
            // Attach the timer
            service.setupPeriodicTimer();

            // Init component
            page.detectChanges();

            expect(page.initialLoadComponent).not.toBeNull('Initial load component visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');

            // Return data
            page.advanceHTTP();

            expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.dataTable.element).not.toBeNull('Data table visible.');

            // Fire highlighters
            page.advanceHighlighter();

            // Discard the service timer
            page.disablePeriodicTimer(RiskLimitUtilizationService);
        })));

    it('refresh data correctly', fakeAsync(inject([HttpService, RiskLimitUtilizationService],
        (http: HttpAsyncServiceStub<RiskLimitUtilizationServerData[]>, service: RiskLimitUtilizationService) => {
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
            let newData = generateRiskLimitUtilizationHistory();
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

            // Discard the service timer
            page.disablePeriodicTimer(RiskLimitUtilizationService);
        })));

    it('has correct pager',
        fakeAsync(inject([HttpService, RiskLimitUtilizationService],
            (http: HttpAsyncServiceStub<RiskLimitUtilizationServerData[]>, service: RiskLimitUtilizationService) => {
                // Attach the timer
                service.setupPeriodicTimer();

                // Init component
                page.detectChanges();
                // Return data
                page.advanceHTTP();
                // Fire highlighters
                page.advanceHighlighter();

                expect(page.dataTable.pager.element).not.toBeNull('Pager visible');
                expect(page.dataTable.recordsCount.message).toContain('Showing 20 records out of ' + Math.pow(3, 3));

                page.dataTable.pager.expectButtonNumbers([1, 2]);
                page.dataTable.pager.expectButtonActive(2);
                page.dataTable.pager.expectLeadingButtonsDisabled();
                page.dataTable.pager.expectTrailingButtonsNotDisabled();

                page.dataTable.pager.click(3);

                page.dataTable.pager.expectButtonNumbers([1, 2]);
                page.dataTable.pager.expectButtonActive(3);
                page.dataTable.pager.expectLeadingButtonsNotDisabled();
                page.dataTable.pager.expectTrailingButtonsDisabled();

                http.returnValue(generateRiskLimitUtilizationHistory());
                // Trigger reload
                page.advanceAndDetectChangesUsingOffset(DATA_REFRESH_INTERVAL);
                page.advanceHTTP();

                expect(page.dataTable.pager.element).toBeNull('Pager not visible');
                expect(page.dataTable.recordsCount.message).toContain('Showing 16 records out of 16');

                // Fire highlighters
                page.advanceHighlighter();

                // Discard the service timer
                page.disablePeriodicTimer(RiskLimitUtilizationService);
            })));

    describe('(after data are ready)', () => {
        beforeEach(fakeAsync(inject([RiskLimitUtilizationService],
            (service: RiskLimitUtilizationService) => {
                // Attach the timer
                service.setupPeriodicTimer();

                // Init component
                page.detectChanges();
                // Return data
                page.advanceHTTP();

                // Discard the service timer
                page.disablePeriodicTimer(RiskLimitUtilizationService);

                // Fire highlighters
                page.advanceHighlighter();
            })));

        xit('displays data correctly', fakeAsync(() => {
        }));

        it('has filtering working', fakeAsync(() => {
            let data = page.dataTable.data;
            let firstRow = data[0];
            let originalItems = data.length;
            let items = originalItems;
            let filter = '';
            let idParts = firstRow.uid.split('-');
            for (let id of idParts) {
                filter += id + ' ';
                page.filter(filter);
                data = page.dataTable.data;

                expect(items >= data.length).toBeTruthy();
                items = data.length;
                data.forEach((row: RiskLimitUtilizationData) => {
                    expect(filter.trim().split(' ').every(
                        (part: string) => page.component.matchObject(row, part)))
                        .toBeTruthy('Has to contain all parts of the filter.');
                });
            }

            // Clear the field
            page.filter('');
            data = page.dataTable.data;

            expect(data.length).toBe(originalItems);

            filter = idParts.join(' ');
            page.filter(filter);
            data = page.dataTable.data;

            data.forEach((row: RiskLimitUtilizationData) => {
                expect(idParts.every(
                    (part: string) => page.component.matchObject(row, part)))
                    .toBeTruthy('Has to contain all parts of the filter.');
            });

            // Remove highlight
            page.advanceHighlighter();
        }));

        it('has correct breadcrumbs navigation', fakeAsync(inject([ActivatedRoute],
            (activatedRoute: ActivatedRouteStub<RiskLimitUtilizationParams>) => {
                let routeParams: string[] = [];

                page.checkBreadCrumbs(routeParams,
                    ROUTES.RISK_LIMIT_UTILIZATION_LATEST,
                    'Latest Risk Limit Utilization');

                routeParams.push('A');
                activatedRoute.testParams = {
                    clearer: routeParams[0]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.RISK_LIMIT_UTILIZATION_LATEST,
                    'Latest Risk Limit Utilization');

                routeParams.push('B');
                activatedRoute.testParams = {
                    clearer: routeParams[0],
                    member : routeParams[1]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.RISK_LIMIT_UTILIZATION_LATEST,
                    'Latest Risk Limit Utilization');

                routeParams.push('C');
                activatedRoute.testParams = {
                    clearer   : routeParams[0],
                    member    : routeParams[1],
                    maintainer: routeParams[2]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.RISK_LIMIT_UTILIZATION_LATEST,
                    'Latest Risk Limit Utilization');

                routeParams.push('D');
                activatedRoute.testParams = {
                    clearer   : routeParams[0],
                    member    : routeParams[1],
                    maintainer: routeParams[2],
                    limitType : routeParams[3]
                };
                page.detectChanges();

                page.checkBreadCrumbs(routeParams,
                    ROUTES.RISK_LIMIT_UTILIZATION_LATEST,
                    'Latest Risk Limit Utilization');
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
            let data = page.dataTable.data;
            expect(exportedData.split('\n')[1]).toContain(exportKeys.slice(0, exportKeys.length - 1).map(
                (key: CSVExportColumn<any>) => key.get(data[0]) ? key.get(data[0]).toString() : '')
                .join(','));
            let cells = exportedData.split('\n')[1].split(',');
            expect(cells[cells.length - 1])
                .toMatch(/^\d{2}\. \d{2}\. \d{4} \d{2}:\d{2}:\d{2}$/);
            expect(exportedData.split('\n').length).toBe(Math.pow(3, 3) + 2);
        }));

        it('can be sorted correctly', fakeAsync(() => {
            chceckSorting(page, [
                valueGetters.member, valueGetters.maintainer, valueGetters.limitType,
                valueGetters.utilization, valueGetters.warningLevel, valueGetters.warningUtil,
                valueGetters.throttleLevel, valueGetters.throttleUtil, valueGetters.rejectLevel,
                valueGetters.rejectUtil
            ]);

            // Fire highlighters
            page.advanceHighlighter();
        }));
    });
});