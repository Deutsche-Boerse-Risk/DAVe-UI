import {async, TestBed, ComponentFixtureAutoDetect, fakeAsync} from "@angular/core/testing";

import {click, TestHostComponent, DataTableDefinitionHosted} from "../../testing";

import {DataTableModule} from "./data.table.module";
import {OrderingCriteria} from "./data.table.column.directive";


describe('DataTable component', () => {

    let table: DataTableDefinitionHosted;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [DataTableModule],
            declarations: [TestHostComponent],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
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

    xit('has correct header', fakeAsync(() => {
        expect(table.dataTable.element).not.toBeNull('Table is shown');

        table.dataTable.component.data = null;
        table.detectChanges();

        expect(table.dataTable.element).toBeNull('Not shown.');
    }));

    xit('has correct body', fakeAsync(() => {
        expect(table.dataTable.element).not.toBeNull('Table is shown');

        table.dataTable.component.data = null;
        table.detectChanges();

        expect(table.dataTable.element).toBeNull('Not shown.');
    }));

    it('can open/close row detail', fakeAsync(() => {
        expect(table.dataTable.element).not.toBeNull('Table is shown');

        // Detail hidden
        expect(table.dataTable.body.tableRowDetailsElements[0].nativeElement.classList).toContain('hidden');
        expect(table.dataTable.body.getTableRowExpanderElement(0).nativeElement.classList)
            .toContain('fa-chevron-circle-down');

        // Click master row
        click(table.dataTable.body.tableRowElements[0]);
        table.detectChanges();

        // Detail shown
        expect(table.dataTable.body.tableRowDetailsElements[0].nativeElement.classList).not.toContain('hidden');
        expect(table.dataTable.body.getTableRowExpanderElement(0).nativeElement.classList)
            .toContain('fa-chevron-circle-up');

        // Click master row
        click(table.dataTable.body.tableRowElements[0]);
        table.detectChanges();

        // Detail hidden
        expect(table.dataTable.body.tableRowDetailsElements[0].nativeElement.classList).toContain('hidden');
        expect(table.dataTable.body.getTableRowExpanderElement(0).nativeElement.classList)
            .toContain('fa-chevron-circle-down');
    }));

    xit('has correct footer', fakeAsync(() => {
        expect(table.dataTable.element).not.toBeNull('Table is shown');

        table.dataTable.component.data = null;
        table.detectChanges();

        expect(table.dataTable.element).toBeNull('Not shown.');
    }));

    it('can be sorted', fakeAsync(() => {
        expect(table.dataTable.element).not.toBeNull('Table is shown');

        expect(table.dataTable.sorting.handles).not.toBeNull('Handles available');
        expect(table.dataTable.sorting.handles.length).not.toBe(2, 'Exactly 2 handles');

        // Check default ordering
        for (let i = 1; i < 500; i++) {
            expect(table.dataTable.data[i - 1].value3 >= table.dataTable.data[i].value3).toBeTruthy('Expect: '
                + table.dataTable.data[i - 1].value3 + ' >= ' + table.dataTable.data[i].value3);
            if (table.dataTable.data[i - 1].value3 === table.dataTable.data[i].value3) {
                expect(table.dataTable.data[i - 1].value2 <= table.dataTable.data[i].value2).toBeTruthy('Expect: '
                    + table.dataTable.data[i - 1].value2 + ' <= ' + table.dataTable.data[i].value2);
            }
        }

        // Check if we are in line with default criteria
        // Compare at least descending flags
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([true, false]);

        // Click handle 0
        click(table.dataTable.sorting.handles[0]);
        table.detectChanges();

        // Check whether new criteria are in line
        expect(table.dataTable.sorting.currentOrdering.length).toBe(3);
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([false, true, false]);

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(table.dataTable.data[i - 1].value1 <= table.dataTable.data[i].value1).toBeTruthy('Expect: '
                + table.dataTable.data[i - 1].value1 + ' <= ' + table.dataTable.data[i].value1);
            if (table.dataTable.data[i - 1].value1 === table.dataTable.data[i].value1) {
                expect(table.dataTable.data[i - 1].value3 >= table.dataTable.data[i].value3).toBeTruthy('Expect: '
                    + table.dataTable.data[i - 1].value3 + ' >= ' + table.dataTable.data[i].value3);
                if (table.dataTable.data[i - 1].value3 === table.dataTable.data[i].value3) {
                    expect(table.dataTable.data[i - 1].value2 <= table.dataTable.data[i].value2)
                        .toBeTruthy('Expect: ' + table.dataTable.data[i - 1].value2 + ' <= '
                            + table.dataTable.data[i].value2);
                }
            }
        }

        // Click handle 0
        click(table.dataTable.sorting.handles[0]);
        table.detectChanges();

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(table.dataTable.data[i - 1].value1 >= table.dataTable.data[i].value1).toBeTruthy('Expect: '
                + table.dataTable.data[i - 1].value1 + ' >= ' + table.dataTable.data[i].value1);
            if (table.dataTable.data[i - 1].value1 === table.dataTable.data[i].value1) {
                expect(table.dataTable.data[i - 1].value3 >= table.dataTable.data[i].value3).toBeTruthy('Expect: '
                    + table.dataTable.data[i - 1].value3 + ' >= ' + table.dataTable.data[i].value3);
                if (table.dataTable.data[i - 1].value3 === table.dataTable.data[i].value3) {
                    expect(table.dataTable.data[i - 1].value2 <= table.dataTable.data[i].value2)
                        .toBeTruthy('Expect: ' + table.dataTable.data[i - 1].value2 + ' <= '
                            + table.dataTable.data[i].value2);
                }
            }
        }

        // Check whether new criteria are in line
        expect(table.dataTable.sorting.currentOrdering.length).toBe(3);
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([true, true, false]);

        // Click handle 0
        click(table.dataTable.sorting.handles[0]);
        table.detectChanges();

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(table.dataTable.data[i - 1].value1 <= table.dataTable.data[i].value1).toBeTruthy('Expect: '
                + table.dataTable.data[i - 1].value1 + ' <= ' + table.dataTable.data[i].value1);
            if (table.dataTable.data[i - 1].value1 === table.dataTable.data[i].value1) {
                expect(table.dataTable.data[i - 1].value3 >= table.dataTable.data[i].value3).toBeTruthy('Expect: '
                    + table.dataTable.data[i - 1].value3 + ' >= ' + table.dataTable.data[i].value3);
                if (table.dataTable.data[i - 1].value3 === table.dataTable.data[i].value3) {
                    expect(table.dataTable.data[i - 1].value2 <= table.dataTable.data[i].value2)
                        .toBeTruthy('Expect: ' + table.dataTable.data[i - 1].value2 + ' <= '
                            + table.dataTable.data[i].value2);
                }
            }
        }

        // Check whether new criteria are in line
        expect(table.dataTable.sorting.currentOrdering.length).toBe(3);
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([false, true, false]);
    }));

    it('can be sorted from header in row detail', fakeAsync(() => {
        expect(table.dataTable.element).not.toBeNull('Table is shown');

        expect(table.dataTable.sorting.handles).not.toBeNull('Handles available');
        expect(table.dataTable.sorting.handles.length).not.toBe(2, 'Exactly 2 handles');

        // Check default ordering
        for (let i = 1; i < 500; i++) {
            expect(table.dataTable.data[i - 1].value3 >= table.dataTable.data[i].value3).toBeTruthy('Expect: '
                + table.dataTable.data[i - 1].value3 + ' >= ' + table.dataTable.data[i].value3);
            if (table.dataTable.data[i - 1].value3 === table.dataTable.data[i].value3) {
                expect(table.dataTable.data[i - 1].value2 <= table.dataTable.data[i].value2)
                    .toBeTruthy('Expect: ' + table.dataTable.data[i - 1].value2 + ' <= '
                        + table.dataTable.data[i].value2);
            }
        }

        // Check if we are in line with default criteria
        // Compare at least descending flags
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([true, false]);

        // Click handle 1
        click(table.dataTable.sorting.handles[1]);
        table.detectChanges();

        // Check whether new criteria are in line
        expect(table.dataTable.sorting.currentOrdering.length).toBe(3);
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([false, true, false]);

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(table.dataTable.data[i - 1].value1 <= table.dataTable.data[i].value1).toBeTruthy('Expect: '
                + table.dataTable.data[i - 1].value1 + ' <= ' + table.dataTable.data[i].value1);
            if (table.dataTable.data[i - 1].value1 === table.dataTable.data[i].value1) {
                expect(table.dataTable.data[i - 1].value3 >= table.dataTable.data[i].value3).toBeTruthy('Expect: '
                    + table.dataTable.data[i - 1].value3 + ' >= ' + table.dataTable.data[i].value3);
                if (table.dataTable.data[i - 1].value3 === table.dataTable.data[i].value3) {
                    expect(table.dataTable.data[i - 1].value2 <= table.dataTable.data[i].value2)
                        .toBeTruthy('Expect: ' + table.dataTable.data[i - 1].value2 + ' <= '
                            + table.dataTable.data[i].value2);
                }
            }
        }

        // Click handle 1
        click(table.dataTable.sorting.handles[1]);
        table.detectChanges();

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(table.dataTable.data[i - 1].value1 >= table.dataTable.data[i].value1).toBeTruthy('Expect: '
                + table.dataTable.data[i - 1].value1 + ' >= ' + table.dataTable.data[i].value1);
            if (table.dataTable.data[i - 1].value1 === table.dataTable.data[i].value1) {
                expect(table.dataTable.data[i - 1].value3 >= table.dataTable.data[i].value3).toBeTruthy('Expect: '
                    + table.dataTable.data[i - 1].value3 + ' >= ' + table.dataTable.data[i].value3);
                if (table.dataTable.data[i - 1].value3 === table.dataTable.data[i].value3) {
                    expect(table.dataTable.data[i - 1].value2 <= table.dataTable.data[i].value2)
                        .toBeTruthy('Expect: ' + table.dataTable.data[i - 1].value2 + ' <= '
                            + table.dataTable.data[i].value2);
                }
            }
        }

        // Check whether new criteria are in line
        expect(table.dataTable.sorting.currentOrdering.length).toBe(3);
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([true, true, false]);

        // Click handle 1
        click(table.dataTable.sorting.handles[1]);
        table.detectChanges();

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(table.dataTable.data[i - 1].value1 <= table.dataTable.data[i].value1).toBeTruthy('Expect: '
                + table.dataTable.data[i - 1].value1 + ' <= ' + table.dataTable.data[i].value1);
            if (table.dataTable.data[i - 1].value1 === table.dataTable.data[i].value1) {
                expect(table.dataTable.data[i - 1].value3 >= table.dataTable.data[i].value3).toBeTruthy('Expect: '
                    + table.dataTable.data[i - 1].value3 + ' >= ' + table.dataTable.data[i].value3);
                if (table.dataTable.data[i - 1].value3 === table.dataTable.data[i].value3) {
                    expect(table.dataTable.data[i - 1].value2 <= table.dataTable.data[i].value2)
                        .toBeTruthy('Expect: ' + table.dataTable.data[i - 1].value2 + ' <= '
                            + table.dataTable.data[i].value2);
                }
            }
        }

        // Check whether new criteria are in line
        expect(table.dataTable.sorting.currentOrdering.length).toBe(3);
        expect(table.dataTable.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([false, true, false]);
    }));
});