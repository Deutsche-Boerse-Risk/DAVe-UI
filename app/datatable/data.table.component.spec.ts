import {async, TestBed, ComponentFixtureAutoDetect, fakeAsync, tick} from "@angular/core/testing";

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
        table.fixture.detectChanges();
        tick();
    }));

    it('is showing correct records count', () => {
        // Display only some rows with pager
        expect(table.recordsCount.message).toContain('Showing ' + table.dataTableComponent.pageSize + ' records out of '
            + table.tableData.length);

        // Display all rows without pager
        delete table.dataTableComponent.pageSize;
        table.fixture.detectChanges();

        expect(table.recordsCount.message).toContain('Showing ' + table.tableData.length + ' records out of '
            + table.tableData.length);

        // Display no rows
        table.dataTableComponent.data = null;
        table.fixture.detectChanges();

        expect(table.recordsCount.element).toBeNull('Not shown.');
    });

    xit('has correct header', () => {
        expect(table.tableElement).not.toBeNull('Table is shown');

        table.dataTableComponent.data = null;
        table.fixture.detectChanges();

        expect(table.tableElement).toBeNull('Not shown.');
    });

    xit('has correct body', () => {
        expect(table.tableElement).not.toBeNull('Table is shown');

        table.dataTableComponent.data = null;
        table.fixture.detectChanges();

        expect(table.tableElement).toBeNull('Not shown.');
    });

    it('can open/close row detail', () => {
        expect(table.tableElement).not.toBeNull('Table is shown');

        // Detail hidden
        expect(table.body.tableRowDetailsElements[0].nativeElement.classList).toContain('hidden');
        expect(table.body.getTableRowExpanderElement(0).nativeElement.classList).toContain('fa-chevron-circle-down');

        // Click master row
        click(table.body.tableRowElements[0]);
        table.fixture.detectChanges();

        // Detail shown
        expect(table.body.tableRowDetailsElements[0].nativeElement.classList).not.toContain('hidden');
        expect(table.body.getTableRowExpanderElement(0).nativeElement.classList).toContain('fa-chevron-circle-up');

        // Click master row
        click(table.body.tableRowElements[0]);
        table.fixture.detectChanges();

        // Detail hidden
        expect(table.body.tableRowDetailsElements[0].nativeElement.classList).toContain('hidden');
        expect(table.body.getTableRowExpanderElement(0).nativeElement.classList).toContain('fa-chevron-circle-down');
    });

    xit('has correct footer', () => {
        expect(table.tableElement).not.toBeNull('Table is shown');

        table.dataTableComponent.data = null;
        table.fixture.detectChanges();

        expect(table.tableElement).toBeNull('Not shown.');
    });

    it('can be sorted', () => {
        expect(table.tableElement).not.toBeNull('Table is shown');

        expect(table.sorting.handles).not.toBeNull('Handles available');
        expect(table.sorting.handles.length).not.toBe(2, 'Exactly 2 handles');

        // Check default ordering
        for (let i = 1; i < 500; i++) {
            expect(table.tableData[i - 1].value3 >= table.tableData[i].value3).toBeTruthy('Expect: '
                + table.tableData[i - 1].value3 + ' >= ' + table.tableData[i].value3);
            if (table.tableData[i - 1].value3 === table.tableData[i].value3) {
                expect(table.tableData[i - 1].value2 <= table.tableData[i].value2).toBeTruthy('Expect: '
                    + table.tableData[i - 1].value2 + ' <= ' + table.tableData[i].value2);
            }
        }

        // Check if we are in line with default criteria
        // Compare at least descending flags
        expect(table.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([true, false]);

        // Click handle 0
        click(table.sorting.handles[0]);
        table.fixture.detectChanges();

        // Check whether new criteria are in line
        expect(table.sorting.currentOrdering.length).toBe(3);
        expect(table.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([false, true, false]);

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(table.tableData[i - 1].value1 <= table.tableData[i].value1).toBeTruthy('Expect: '
                + table.tableData[i - 1].value1 + ' <= ' + table.tableData[i].value1);
            if (table.tableData[i - 1].value1 === table.tableData[i].value1) {
                expect(table.tableData[i - 1].value3 >= table.tableData[i].value3).toBeTruthy('Expect: '
                    + table.tableData[i - 1].value3 + ' >= ' + table.tableData[i].value3);
                if (table.tableData[i - 1].value3 === table.tableData[i].value3) {
                    expect(table.tableData[i - 1].value2 <= table.tableData[i].value2).toBeTruthy('Expect: '
                        + table.tableData[i - 1].value2 + ' <= ' + table.tableData[i].value2);
                }
            }
        }

        // Click handle 0
        click(table.sorting.handles[0]);
        table.fixture.detectChanges();

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(table.tableData[i - 1].value1 >= table.tableData[i].value1).toBeTruthy('Expect: '
                + table.tableData[i - 1].value1 + ' >= ' + table.tableData[i].value1);
            if (table.tableData[i - 1].value1 === table.tableData[i].value1) {
                expect(table.tableData[i - 1].value3 >= table.tableData[i].value3).toBeTruthy('Expect: '
                    + table.tableData[i - 1].value3 + ' >= ' + table.tableData[i].value3);
                if (table.tableData[i - 1].value3 === table.tableData[i].value3) {
                    expect(table.tableData[i - 1].value2 <= table.tableData[i].value2).toBeTruthy('Expect: '
                        + table.tableData[i - 1].value2 + ' <= ' + table.tableData[i].value2);
                }
            }
        }

        // Check whether new criteria are in line
        expect(table.sorting.currentOrdering.length).toBe(3);
        expect(table.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([true, true, false]);

        // Click handle 0
        click(table.sorting.handles[0]);
        table.fixture.detectChanges();

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(table.tableData[i - 1].value1 <= table.tableData[i].value1).toBeTruthy('Expect: '
                + table.tableData[i - 1].value1 + ' <= ' + table.tableData[i].value1);
            if (table.tableData[i - 1].value1 === table.tableData[i].value1) {
                expect(table.tableData[i - 1].value3 >= table.tableData[i].value3).toBeTruthy('Expect: '
                    + table.tableData[i - 1].value3 + ' >= ' + table.tableData[i].value3);
                if (table.tableData[i - 1].value3 === table.tableData[i].value3) {
                    expect(table.tableData[i - 1].value2 <= table.tableData[i].value2).toBeTruthy('Expect: '
                        + table.tableData[i - 1].value2 + ' <= ' + table.tableData[i].value2);
                }
            }
        }

        // Check whether new criteria are in line
        expect(table.sorting.currentOrdering.length).toBe(3);
        expect(table.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([false, true, false]);
    });

    it('can be sorted from header in row detail', () => {
        expect(table.tableElement).not.toBeNull('Table is shown');

        expect(table.sorting.handles).not.toBeNull('Handles available');
        expect(table.sorting.handles.length).not.toBe(2, 'Exactly 2 handles');

        // Check default ordering
        for (let i = 1; i < 500; i++) {
            expect(table.tableData[i - 1].value3 >= table.tableData[i].value3).toBeTruthy('Expect: '
                + table.tableData[i - 1].value3 + ' >= ' + table.tableData[i].value3);
            if (table.tableData[i - 1].value3 === table.tableData[i].value3) {
                expect(table.tableData[i - 1].value2 <= table.tableData[i].value2).toBeTruthy('Expect: '
                    + table.tableData[i - 1].value2 + ' <= ' + table.tableData[i].value2);
            }
        }

        // Check if we are in line with default criteria
        // Compare at least descending flags
        expect(table.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([true, false]);

        // Click handle 1
        click(table.sorting.handles[1]);
        table.fixture.detectChanges();

        // Check whether new criteria are in line
        expect(table.sorting.currentOrdering.length).toBe(3);
        expect(table.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([false, true, false]);

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(table.tableData[i - 1].value1 <= table.tableData[i].value1).toBeTruthy('Expect: '
                + table.tableData[i - 1].value1 + ' <= ' + table.tableData[i].value1);
            if (table.tableData[i - 1].value1 === table.tableData[i].value1) {
                expect(table.tableData[i - 1].value3 >= table.tableData[i].value3).toBeTruthy('Expect: '
                    + table.tableData[i - 1].value3 + ' >= ' + table.tableData[i].value3);
                if (table.tableData[i - 1].value3 === table.tableData[i].value3) {
                    expect(table.tableData[i - 1].value2 <= table.tableData[i].value2).toBeTruthy('Expect: '
                        + table.tableData[i - 1].value2 + ' <= ' + table.tableData[i].value2);
                }
            }
        }

        // Click handle 1
        click(table.sorting.handles[1]);
        table.fixture.detectChanges();

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(table.tableData[i - 1].value1 >= table.tableData[i].value1).toBeTruthy('Expect: '
                + table.tableData[i - 1].value1 + ' >= ' + table.tableData[i].value1);
            if (table.tableData[i - 1].value1 === table.tableData[i].value1) {
                expect(table.tableData[i - 1].value3 >= table.tableData[i].value3).toBeTruthy('Expect: '
                    + table.tableData[i - 1].value3 + ' >= ' + table.tableData[i].value3);
                if (table.tableData[i - 1].value3 === table.tableData[i].value3) {
                    expect(table.tableData[i - 1].value2 <= table.tableData[i].value2).toBeTruthy('Expect: '
                        + table.tableData[i - 1].value2 + ' <= ' + table.tableData[i].value2);
                }
            }
        }

        // Check whether new criteria are in line
        expect(table.sorting.currentOrdering.length).toBe(3);
        expect(table.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([true, true, false]);

        // Click handle 1
        click(table.sorting.handles[1]);
        table.fixture.detectChanges();

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(table.tableData[i - 1].value1 <= table.tableData[i].value1).toBeTruthy('Expect: '
                + table.tableData[i - 1].value1 + ' <= ' + table.tableData[i].value1);
            if (table.tableData[i - 1].value1 === table.tableData[i].value1) {
                expect(table.tableData[i - 1].value3 >= table.tableData[i].value3).toBeTruthy('Expect: '
                    + table.tableData[i - 1].value3 + ' >= ' + table.tableData[i].value3);
                if (table.tableData[i - 1].value3 === table.tableData[i].value3) {
                    expect(table.tableData[i - 1].value2 <= table.tableData[i].value2).toBeTruthy('Expect: '
                        + table.tableData[i - 1].value2 + ' <= ' + table.tableData[i].value2);
                }
            }
        }

        // Check whether new criteria are in line
        expect(table.sorting.currentOrdering.length).toBe(3);
        expect(table.sorting.currentOrdering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([false, true, false]);
    });
});