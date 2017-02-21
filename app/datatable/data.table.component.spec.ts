import {Component, DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

import {ComponentFixture, async, TestBed, ComponentFixtureAutoDetect, fakeAsync, tick} from "@angular/core/testing";

import {DataTableModule} from "./data.table.module";
import {OrderingValueGetter, OrderingCriteria} from "./data.table.column.directive";
import {DataTableComponent} from "./data.table.component";
import {click} from "../../testing/index";
import {DataTableRowDetailExpander} from "./data.table.row.detail.expander.component";

describe('DataTable component', () => {

    let page: DataTablePage;

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
        page = new DataTablePage(TestBed.createComponent(TestHostComponent));
        page.fixture.detectChanges();
        tick();
    }));

    it('is showing correct records count', () => {
        // Display only some rows with pager
        expect(page.recordsCountMessage).toContain('Showing ' + page.dataTableComponent.pageSize + ' records out of '
            + page.tableData.length);

        // Display all rows without pager
        delete page.dataTableComponent.pageSize;
        page.fixture.detectChanges();

        expect(page.recordsCountMessage).toContain('Showing ' + page.tableData.length + ' records out of '
            + page.tableData.length);

        // Display no rows
        page.dataTableComponent.data = null;
        page.fixture.detectChanges();

        expect(page.recordsCountElement).toBeNull('Not shown.');
    });

    // it('is has correct header', () => {
    //     expect(page.tableElement).not.toBeNull('Table is shown');
    //
    //     page.dataTableComponent.data = null;
    //     page.fixture.detectChanges();
    //
    //     expect(page.tableElement).toBeNull('Not shown.');
    // });
    //
    // it('is has correct body', () => {
    //     expect(page.tableElement).not.toBeNull('Table is shown');
    //
    //     page.dataTableComponent.data = null;
    //     page.fixture.detectChanges();
    //
    //     expect(page.tableElement).toBeNull('Not shown.');
    // });

    it('can open/close row detail', () => {
        expect(page.tableElement).not.toBeNull('Table is shown');

        // Detail hidden
        expect(page.tableRowDetailsElements[0].nativeElement.classList).toContain('hidden');
        expect(page.getTableRowExpanderElement(0).nativeElement.classList).toContain('fa-chevron-circle-down');

        // Click master row
        click(page.tableRowElements[0]);
        page.fixture.detectChanges();

        // Detail shown
        expect(page.tableRowDetailsElements[0].nativeElement.classList).not.toContain('hidden');
        expect(page.getTableRowExpanderElement(0).nativeElement.classList).toContain('fa-chevron-circle-up');

        // Click master row
        click(page.tableRowElements[0]);
        page.fixture.detectChanges();

        // Detail hidden
        expect(page.tableRowDetailsElements[0].nativeElement.classList).toContain('hidden');
        expect(page.getTableRowExpanderElement(0).nativeElement.classList).toContain('fa-chevron-circle-down');
    });

    // it('is has correct footer', () => {
    //     expect(page.tableElement).not.toBeNull('Table is shown');
    //
    //     page.dataTableComponent.data = null;
    //     page.fixture.detectChanges();
    //
    //     expect(page.tableElement).toBeNull('Not shown.');
    // });

    it('can be sorted', () => {
        expect(page.tableElement).not.toBeNull('Table is shown');

        expect(page.sortingHandles).not.toBeNull('Handles available');
        expect(page.sortingHandles.length).not.toBe(2, 'Exactly 2 handles');

        // Check default ordering
        for (let i = 1; i < 500; i++) {
            expect(page.tableData[i - 1].value3 >= page.tableData[i].value3).toBeTruthy('Expect: '
                + page.tableData[i - 1].value3 + ' >= ' + page.tableData[i].value3);
            if (page.tableData[i - 1].value3 === page.tableData[i].value3) {
                expect(page.tableData[i - 1].value2 <= page.tableData[i].value2).toBeTruthy('Expect: '
                    + page.tableData[i - 1].value2 + ' <= ' + page.tableData[i].value2);
            }
        }

        // Check if we are in line with default criteria
        // Compare at least descending flags
        expect(page.ordering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([true, false]);

        // Click handle 0
        click(page.sortingHandles[0]);
        page.fixture.detectChanges();

        // Check whether new criteria are in line
        expect(page.ordering.length).toBe(3);
        expect(page.ordering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([false, true, false]);

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(page.tableData[i - 1].value1 <= page.tableData[i].value1).toBeTruthy('Expect: '
                + page.tableData[i - 1].value1 + ' <= ' + page.tableData[i].value1);
            if (page.tableData[i - 1].value1 === page.tableData[i].value1) {
                expect(page.tableData[i - 1].value3 >= page.tableData[i].value3).toBeTruthy('Expect: '
                    + page.tableData[i - 1].value3 + ' >= ' + page.tableData[i].value3);
                if (page.tableData[i - 1].value3 === page.tableData[i].value3) {
                    expect(page.tableData[i - 1].value2 <= page.tableData[i].value2).toBeTruthy('Expect: '
                        + page.tableData[i - 1].value2 + ' <= ' + page.tableData[i].value2);
                }
            }
        }

        // Click handle 0
        click(page.sortingHandles[0]);
        page.fixture.detectChanges();

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(page.tableData[i - 1].value1 >= page.tableData[i].value1).toBeTruthy('Expect: '
                + page.tableData[i - 1].value1 + ' >= ' + page.tableData[i].value1);
            if (page.tableData[i - 1].value1 === page.tableData[i].value1) {
                expect(page.tableData[i - 1].value3 >= page.tableData[i].value3).toBeTruthy('Expect: '
                    + page.tableData[i - 1].value3 + ' >= ' + page.tableData[i].value3);
                if (page.tableData[i - 1].value3 === page.tableData[i].value3) {
                    expect(page.tableData[i - 1].value2 <= page.tableData[i].value2).toBeTruthy('Expect: '
                        + page.tableData[i - 1].value2 + ' <= ' + page.tableData[i].value2);
                }
            }
        }

        // Check whether new criteria are in line
        expect(page.ordering.length).toBe(3);
        expect(page.ordering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([true, true, false]);

        // Click handle 0
        click(page.sortingHandles[0]);
        page.fixture.detectChanges();

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(page.tableData[i - 1].value1 <= page.tableData[i].value1).toBeTruthy('Expect: '
                + page.tableData[i - 1].value1 + ' <= ' + page.tableData[i].value1);
            if (page.tableData[i - 1].value1 === page.tableData[i].value1) {
                expect(page.tableData[i - 1].value3 >= page.tableData[i].value3).toBeTruthy('Expect: '
                    + page.tableData[i - 1].value3 + ' >= ' + page.tableData[i].value3);
                if (page.tableData[i - 1].value3 === page.tableData[i].value3) {
                    expect(page.tableData[i - 1].value2 <= page.tableData[i].value2).toBeTruthy('Expect: '
                        + page.tableData[i - 1].value2 + ' <= ' + page.tableData[i].value2);
                }
            }
        }

        // Check whether new criteria are in line
        expect(page.ordering.length).toBe(3);
        expect(page.ordering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([false, true, false]);
    });

    it('can be sorted from header in row detail', () => {
        expect(page.tableElement).not.toBeNull('Table is shown');

        expect(page.sortingHandles).not.toBeNull('Handles available');
        expect(page.sortingHandles.length).not.toBe(2, 'Exactly 2 handles');

        // Check default ordering
        for (let i = 1; i < 500; i++) {
            expect(page.tableData[i - 1].value3 >= page.tableData[i].value3).toBeTruthy('Expect: '
                + page.tableData[i - 1].value3 + ' >= ' + page.tableData[i].value3);
            if (page.tableData[i - 1].value3 === page.tableData[i].value3) {
                expect(page.tableData[i - 1].value2 <= page.tableData[i].value2).toBeTruthy('Expect: '
                    + page.tableData[i - 1].value2 + ' <= ' + page.tableData[i].value2);
            }
        }

        // Check if we are in line with default criteria
        // Compare at least descending flags
        expect(page.ordering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([true, false]);

        // Click handle 1
        click(page.sortingHandles[1]);
        page.fixture.detectChanges();

        // Check whether new criteria are in line
        expect(page.ordering.length).toBe(3);
        expect(page.ordering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([false, true, false]);

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(page.tableData[i - 1].value1 <= page.tableData[i].value1).toBeTruthy('Expect: '
                + page.tableData[i - 1].value1 + ' <= ' + page.tableData[i].value1);
            if (page.tableData[i - 1].value1 === page.tableData[i].value1) {
                expect(page.tableData[i - 1].value3 >= page.tableData[i].value3).toBeTruthy('Expect: '
                    + page.tableData[i - 1].value3 + ' >= ' + page.tableData[i].value3);
                if (page.tableData[i - 1].value3 === page.tableData[i].value3) {
                    expect(page.tableData[i - 1].value2 <= page.tableData[i].value2).toBeTruthy('Expect: '
                        + page.tableData[i - 1].value2 + ' <= ' + page.tableData[i].value2);
                }
            }
        }

        // Click handle 1
        click(page.sortingHandles[1]);
        page.fixture.detectChanges();

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(page.tableData[i - 1].value1 >= page.tableData[i].value1).toBeTruthy('Expect: '
                + page.tableData[i - 1].value1 + ' >= ' + page.tableData[i].value1);
            if (page.tableData[i - 1].value1 === page.tableData[i].value1) {
                expect(page.tableData[i - 1].value3 >= page.tableData[i].value3).toBeTruthy('Expect: '
                    + page.tableData[i - 1].value3 + ' >= ' + page.tableData[i].value3);
                if (page.tableData[i - 1].value3 === page.tableData[i].value3) {
                    expect(page.tableData[i - 1].value2 <= page.tableData[i].value2).toBeTruthy('Expect: '
                        + page.tableData[i - 1].value2 + ' <= ' + page.tableData[i].value2);
                }
            }
        }

        // Check whether new criteria are in line
        expect(page.ordering.length).toBe(3);
        expect(page.ordering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([true, true, false]);

        // Click handle 1
        click(page.sortingHandles[1]);
        page.fixture.detectChanges();

        // Check current ordering
        for (let i = 1; i < 500; i++) {
            expect(page.tableData[i - 1].value1 <= page.tableData[i].value1).toBeTruthy('Expect: '
                + page.tableData[i - 1].value1 + ' <= ' + page.tableData[i].value1);
            if (page.tableData[i - 1].value1 === page.tableData[i].value1) {
                expect(page.tableData[i - 1].value3 >= page.tableData[i].value3).toBeTruthy('Expect: '
                    + page.tableData[i - 1].value3 + ' >= ' + page.tableData[i].value3);
                if (page.tableData[i - 1].value3 === page.tableData[i].value3) {
                    expect(page.tableData[i - 1].value2 <= page.tableData[i].value2).toBeTruthy('Expect: '
                        + page.tableData[i - 1].value2 + ' <= ' + page.tableData[i].value2);
                }
            }
        }

        // Check whether new criteria are in line
        expect(page.ordering.length).toBe(3);
        expect(page.ordering.map((item: OrderingCriteria<any>) => {
            return item.descending
        })).toEqual([false, true, false]);
    });
});

class DataTablePage {

    public hostComponent: TestHostComponent;
    public hostDebugElement: DebugElement;

    constructor(public fixture: ComponentFixture<TestHostComponent>) {
        this.hostComponent = this.fixture.componentInstance;
        this.hostDebugElement = this.fixture.debugElement;
    }

    public get debugElement(): DebugElement {
        return this.hostDebugElement.query(By.directive(DataTableComponent));
    }

    public get dataTableComponent(): DataTableComponent {
        return this.debugElement.componentInstance;
    }

    public get tableData(): any[] {
        return this.dataTableComponent.data;
    }

    public get tableElement(): DebugElement {
        return this.debugElement.query(By.css('.table.table-bordered.table-hover'));
    }

    public get tableHeaderElement(): DebugElement {
        return this.tableElement.query(By.css('thead'));
    }

    public get sortingHandles(): DebugElement[] {
        return this.tableElement.queryAll(By.css('thead .fa-sort'));
    }

    public get ordering(): OrderingCriteria<any>[] {
        return (this.dataTableComponent as any).ordering;
    }

    public get defaultOrdering(): OrderingCriteria<any>[] {
        return (this.dataTableComponent as any)._defaultOrdering;
    }

    public get tableBodyElement(): DebugElement {
        return this.tableElement.query(By.css('tbody'));
    }

    public get tableRowElements(): DebugElement[] {
        return this.tableBodyElement.queryAll(de => de.references['masterRow']);
    }

    public getTableRowExpanderElement(rowIndex: number): DebugElement {
        return this.tableRowElements[rowIndex].query(By.directive(DataTableRowDetailExpander)).query(By.css('.fa'));
    }

    public getTableCellElements(rowIndex: number): DebugElement[] {
        return this.tableRowElements[rowIndex].queryAll(By.css('td'));
    }

    public get tableRowDetailsElements(): DebugElement[] {
        return this.tableBodyElement.queryAll(de => !de.references['masterRow'] && de.name === 'tr');
    }

    public get recordsCountElement(): DebugElement {
        return this.debugElement.query(By.css('.panel-footer'));
    }

    public get recordsCountMessage(): string {
        return this.recordsCountElement.nativeElement.textContent;
    }
}

@Component({
    template: `
<data-table [data]="data"   
                [footer]="footer"
            [pageSize]="20"
            [defaultOrdering]="defaultOrdering"
            [striped]="true">
    <column title="Test Column 1"
            [sortingKey]="valueGetter">
        <template let-record="row" cell-template>
            {{record.value1}}
        </template>
    </column>
    <column>
        <template let-record="row" cell-template>
            <row-detail-expander></row-detail-expander>
        </template>
        <template let-footer="footer" footer-template>
            {{footer.value1}}
        </template>
    </column>
    <!-- Sub detail -->
    <row-detail>
        <column-group>
            <column title="Test Detail Column 1"
                    [sortingKey]="valueGetter">
                <template let-record="row" cell-template>
                    {{record.value1}}
                </template>
            </column>
        </column-group>
        <column-group>
            <column title="Test Detail Column 2">
                <template let-record="row" cell-template>
                    {{record.value2}}
                </template>
            </column>
            <column title="Test Detail Column 3">
                <template let-record="row" cell-template>
                    {{record.value3}}
                </template>
            </column>
        </column-group>
        <column-group></column-group>
    </row-detail>
</data-table>`
})
class TestHostComponent {

    public data: any[];

    public footer: any;

    constructor() {
        this.data = [];
        for (let i = 0; i < 500; i++) {
            this.data.push({
                value1: Math.floor(Math.random() * 20) + ' - value 1',
                value2: Math.floor(Math.random() * 20) + ' - value 2',
                value3: Math.floor(Math.random() * 20) + ' - value 3'
            })
        }
        this.footer = this.data[0];
    }

    public get defaultOrdering(): (OrderingCriteria<any> | OrderingValueGetter<any>)[] {
        return [
            {
                get: (record: any) => {
                    return record.value3;
                },
                descending: true
            },
            (record: any) => {
                return record.value2;
            }
        ]
    }

    public get valueGetter(): (record: any) => any {
        return (record: any) => {
            return record.value1;
        };
    }
}