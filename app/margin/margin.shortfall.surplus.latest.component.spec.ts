import {async, TestBed, fakeAsync, inject} from '@angular/core/testing';

import {
    LatestListPage,
    TableBodyRow,
    HttpAsyncServiceStub,
    generateShortfallSurplusLatest,
    generateMarginShortfallSurplusHistory,
    chceckSorting
} from '../../testing';

import {MarginShortfallSurplusServerData} from './margin.types';
import {MarginShortfallSurplusService} from './margin.shortfall.surplus.service';
import {HttpService} from '../http.service';

import {
    MarginShortfallSurplusLatestComponent, valueGetters,
    exportKeys
} from './margin.shortfall.surplus.latest.component';
import {ExportColumn} from '../list/download.menu.component';

describe('Margin shortfall-surplus latest component', () => {
    let page: LatestListPage<MarginShortfallSurplusLatestComponent>;

    beforeEach(async(() => {
        LatestListPage.initTestBed(MarginShortfallSurplusLatestComponent, MarginShortfallSurplusService);
    }));

    beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<MarginShortfallSurplusServerData[]>) => {
        // Generate test data
        http.returnValue(generateShortfallSurplusLatest());
        // Create component
        page = new LatestListPage<MarginShortfallSurplusLatestComponent>(
            TestBed.createComponent(MarginShortfallSurplusLatestComponent));
    })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<MarginShortfallSurplusServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadComponent).not.toBeNull('Initial load component visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');

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
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<MarginShortfallSurplusServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadComponent).not.toBeNull('Initial load component visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');

            // Return no data
            http.popReturnValue(); // Remove from queue
            http.returnValue([]); // Push empty array
            page.advance(1000);

            expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).not.toBeNull('No data component visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');
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
        page.advance(1000);

        expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
        expect(page.noDataComponent).toBeNull('No data component not visible.');
        expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
        expect(page.dataTable.element).not.toBeNull('Data table visible.');

        // Fire highlighters
        page.advance(15000);
    }));

    it('refresh data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<MarginShortfallSurplusServerData[]>) => {
            // Init component
            page.detectChanges();
            // Return data
            page.advance(1000);

            expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).not.toBeNull('Data table visible.');

            expect(page.dataTable.body.rows.every((row: TableBodyRow) => {
                return row.highlighted;
            })).toBeTruthy('All rows are highlighted');

            // Fire highlighters
            page.advance(15000);

            expect(page.dataTable.body.rows.every((row: TableBodyRow) => {
                return !row.highlighted;
            })).toBeTruthy('No rows are highlighted');

            // Push new data
            let newData = generateMarginShortfallSurplusHistory();
            http.returnValue(newData);
            // Trigger reload
            page.advance(44000);
            // Return the data
            page.advance(1000);

            expect(page.dataTable.element).not.toBeNull('Data table visible.');

            expect(page.dataTable.body.rows.every((row: TableBodyRow) => {
                return row.highlighted;
            })).toBeTruthy('All rows are highlighted');

            // Fire highlighters
            page.advance(15000);

            expect(page.dataTable.body.rows.every((row: TableBodyRow) => {
                return !row.highlighted;
            })).toBeTruthy('No rows are highlighted');

            // Return the same data
            http.returnValue(newData);
            // Trigger reload
            page.advance(44000);
            // Return the data
            page.advance(1000);

            expect(page.dataTable.body.rows.every((row: TableBodyRow) => {
                return !row.highlighted;
            })).toBeTruthy('No rows are highlighted');

            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);
        })));

    it('has correct pager', fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<MarginShortfallSurplusServerData[]>) => {
        // Init component
        page.detectChanges();
        // Return data
        page.advance(1000);
        // Fire highlighters
        page.advance(15000);

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

        http.returnValue(generateMarginShortfallSurplusHistory());
        // Trigger reload
        page.advance(44000);
        // Return the data
        page.advance(1000);

        expect(page.dataTable.pager.element).toBeNull('Pager not visible');
        expect(page.dataTable.recordsCount.message).toContain('Showing 16 records out of 16');

        // Fire highlighters
        page.advance(15000);
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);
    })));

    describe('(after data are ready)', () => {
        beforeEach(fakeAsync(() => {
            // Init component
            page.detectChanges();
            // Return data
            page.advance(1000);
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            // Fire highlighters
            page.advance(15000);
        }));

        xit('displays data correctly', fakeAsync(() => {
        }));

        xit('has filtering working', fakeAsync(() => {
        }));

        xit('has correct breadcrumbs navigation', fakeAsync(() => {
        }));

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
                (key: ExportColumn<any>) => key.header).join(','));
            expect(exportedData.split('\n')[1]).toContain(exportKeys.slice(0, exportKeys.length - 1).map(
                (key: ExportColumn<any>) =>
                    key.get(page.dataTable.data[0]) ? key.get(page.dataTable.data[0]).toString() : '')
                .join(','));
            let cells = exportedData.split('\n')[1].split(',');
            expect(cells[cells.length - 2] + ',' + cells[cells.length - 1])
                .toMatch(/^"\d{2}\/\d{2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)"$/);
            expect(exportedData.split('\n').length).toBe(Math.pow(3, 4) + 2);
        }));

        it('can be sorted correctly', fakeAsync(() => {
            chceckSorting(page, [valueGetters.pool, valueGetters.poolType, valueGetters.member,
                valueGetters.clearingCcy, valueGetters.ccy, valueGetters.shortfallSurplus,
                valueGetters.marginRequirement, valueGetters.securityCollateral, valueGetters.cashBalance,
                valueGetters.marginCall]);

            // Fire highlighters
            page.advance(15000);
        }));
    });
});