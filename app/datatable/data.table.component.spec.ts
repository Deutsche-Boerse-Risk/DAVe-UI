import {async, TestBed, fakeAsync} from '@angular/core/testing';

import {TestHostComponent, DataTableDefinitionHosted, disableMaterialAnimations} from '../../testing';

import {DataTableModule} from './data.table.module';
import {OrderingCriteria} from './data.table.column.directive';

describe('DataTable component', () => {

    let table: DataTableDefinitionHosted;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports     : [DataTableModule],
            declarations: [TestHostComponent]
        });
        disableMaterialAnimations(DataTableModule);
        TestBed.compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        table = new DataTableDefinitionHosted(TestBed.createComponent(TestHostComponent));
        table.detectChanges();
    }));

    it('is showing correct records count', fakeAsync(() => {
        // Display only some rows with pager
        expect(table.dataTable.recordsCount.message).toContain('Showing '
            + table.dataTable.component.pageSize + ' records out of ' + table.dataTable.data.length);

        // Display all rows without pager
        delete table.dataTable.component.pageSize;
        table.detectChanges();

        expect(table.dataTable.recordsCount.message).toContain('Showing '
            + table.dataTable.data.length + ' records out of ' + table.dataTable.data.length);

        // Display no rows
        table.dataTable.component.data = null;
        table.detectChanges();

        expect(table.dataTable.recordsCount.element).toBeNull('Not shown.');
    }));

    it('has no table if data are not defined or empty', fakeAsync(() => {
        expect(table.dataTable.element).not.toBeNull('Table is shown');

        table.dataTable.component.data = null;
        table.detectChanges();

        expect(table.dataTable.element).toBeNull('Not shown.');

        table.dataTable.component.data = [];
        table.detectChanges();

        expect(table.dataTable.element).toBeNull('Not shown.');
    }));

    xit('has correct header', fakeAsync(() => {
        expect(table.dataTable.element).not.toBeNull('Table is shown');
    }));

    xit('has correct body', fakeAsync(() => {
        expect(table.dataTable.element).not.toBeNull('Table is shown');
    }));

    it('can open/close row detail', fakeAsync(() => {
        expect(table.dataTable.element).not.toBeNull('Table is shown');

        let row = table.dataTable.body.rows[0];

        // Detail hidden
        expect(row.rowDetail).toBeNull('Is hidden');
        expect(row.expander.closed).toBeTruthy('Detail closed.');

        // Click master row
        row.expandRow();

        // Detail shown
        expect(row.rowDetail).not.toBeNull('Is shown');
        expect(row.expander.opened).toBeTruthy('Detail opened.');

        // Click master row
        row.expandRow();

        // Detail hidden
        expect(row.rowDetail).toBeNull('Is hidden');
        expect(row.expander.closed).toBeTruthy('Detail closed.');
    }));

    xit('has correct footer', fakeAsync(() => {
        expect(table.dataTable.element).not.toBeNull('Table is shown');
    }));

    it('can be sorted', fakeAsync(() => {
        expect(table.dataTable.element).not.toBeNull('Table is shown');

        expect(table.dataTable.sorting.handles).not.toBeNull('Handles available');
        expect(table.dataTable.sorting.handles.length).toBe(1, 'Exactly 1 handle');

        // Check default ordering
        table.dataTable.sorting.checkSorting(250);

        // Check if we are in line with default criteria
        // Compare at least descending flags
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending;
        })).toEqual([true, false]);

        // Click handle 0
        table.dataTable.sorting.handles[0].click();
        table.detectChanges();

        // Check whether new criteria are in line
        expect(table.dataTable.sorting.currentOrdering.length).toBe(3);
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending;
        })).toEqual([false, true, false]);

        // Check current ordering
        table.dataTable.sorting.checkSorting(250);

        // Click handle 0
        table.dataTable.sorting.handles[0].click();
        table.detectChanges();

        // Check current ordering
        table.dataTable.sorting.checkSorting(250);

        // Check whether new criteria are in line
        expect(table.dataTable.sorting.currentOrdering.length).toBe(3);
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending;
        })).toEqual([true, true, false]);

        // Click handle 0
        table.dataTable.sorting.handles[0].click();
        table.detectChanges();

        // Check current ordering
        table.dataTable.sorting.checkSorting(250);

        // Check whether new criteria are in line
        expect(table.dataTable.sorting.currentOrdering.length).toBe(3);
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending;
        })).toEqual([false, true, false]);
    }));

    it('can be sorted from header in row detail', fakeAsync(() => {
        expect(table.dataTable.element).not.toBeNull('Table is shown');

        // Open the first row
        if (!table.dataTable.body.rows[0].rowDetail) {
            table.dataTable.body.rows[0].expandRow();
        }
        expect(table.dataTable.sorting.detailRowHandles).not.toBeNull('Handles available');
        expect(table.dataTable.sorting.detailRowHandles.length).toBe(1, 'Exactly 1 handle');

        // Check default ordering
        table.dataTable.sorting.checkSorting(250);

        // Check if we are in line with default criteria
        // Compare at least descending flags
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending;
        })).toEqual([true, false]);

        // Open the first row
        if (!table.dataTable.body.rows[0].rowDetail) {
            table.dataTable.body.rows[0].expandRow();
        }
        // Click handle 1
        table.dataTable.sorting.detailRowHandles[0].click();
        table.detectChanges();

        // Check whether new criteria are in line
        expect(table.dataTable.sorting.currentOrdering.length).toBe(3);
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending;
        })).toEqual([false, true, false]);

        // Check current ordering
        table.dataTable.sorting.checkSorting(250);

        // Open the first row
        if (!table.dataTable.body.rows[0].rowDetail) {
            table.dataTable.body.rows[0].expandRow();
        }
        // Click handle 1
        table.dataTable.sorting.detailRowHandles[0].click();
        table.detectChanges();

        // Check current ordering
        table.dataTable.sorting.checkSorting(250);

        // Check whether new criteria are in line
        expect(table.dataTable.sorting.currentOrdering.length).toBe(3);
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending;
        })).toEqual([true, true, false]);

        // Open the first row
        if (!table.dataTable.body.rows[0].rowDetail) {
            table.dataTable.body.rows[0].expandRow();
        }
        // Click handle 1
        table.dataTable.sorting.detailRowHandles[0].click();
        table.detectChanges();

        // Check current ordering
        table.dataTable.sorting.checkSorting(250);

        // Check whether new criteria are in line
        expect(table.dataTable.sorting.currentOrdering.length).toBe(3);
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending;
        })).toEqual([false, true, false]);
    }));
});