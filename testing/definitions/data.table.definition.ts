import {Component, DebugElement} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {OrderingValueGetter, OrderingCriteria} from '../../app/datatable/data.table.column.directive';
import {DataTableComponent} from '../../app/datatable/data.table.component';
import {DataTableRowDetailExpander} from '../../app/datatable/data.table.row.detail.expander.component';
import {PagingComponent} from '../../app/datatable/paging.component';

import {click} from '../events';
import {Page} from './page.base';

export class DataTableDefinition {

    constructor(public debugElement: DebugElement, private page: {detectChanges: () => void}) {
    }

    public get component(): DataTableComponent {
        return this.debugElement.componentInstance;
    }

    public get data(): any[] {
        return this.component.data;
    }

    public get element(): DebugElement {
        return this.debugElement.query(By.css('.table.table-bordered.table-hover'));
    }

    public get header(): TableHeader {
        return new TableHeader(this.element);
    }

    public get sorting(): TableSorting {
        return new TableSorting(this, this.element, this.component, this.page);
    }

    public get body(): TableBody {
        return new TableBody(this.page, this.element);
    }

    public get recordsCount(): RecordsCount {
        return new RecordsCount(this.debugElement);
    }

    public get pager(): Pager {
        return new Pager(this.debugElement, this.page);
    }
}

export class DataTableDefinitionHosted extends Page<TestHostComponent> {

    constructor(fixture: ComponentFixture<TestHostComponent>) {
        super(fixture);
    }

    public get dataTable(): DataTableDefinition {
        return new DataTableDefinition(this.debugElement.query(By.directive(DataTableComponent)), this);
    }
}

export class TableHeader {

    constructor(public tableElement: DebugElement) {
    }

    public get tableHeaderElement(): DebugElement {
        return this.tableElement.query(By.css('thead'));
    }
}

export class TableSorting {

    constructor(private table: DataTableDefinition, private tableElement: DebugElement,
                private dataTableComponent: DataTableComponent, private page: {detectChanges: () => void}) {
    }

    public get handles(): SortingHandle[] {
        let handles = this.tableElement.query(de => de.references['mainHeader']).queryAll(By.css('.fa-sort'));
        if (!handles) {
            return null;
        }
        return handles.map((handle: DebugElement) => {
            return new SortingHandle(this.page, handle);
        });
    }

    public get detailRowHandles(): SortingHandle[] {
        let handles = this.tableElement.query(By.css('.table-condensed')).queryAll(By.css('thead .fa-sort'))
        if (!handles) {
            return null;
        }
        return handles.map((handle: DebugElement) => {
            return new SortingHandle(this.page, handle);
        });
    }

    public get currentOrdering(): OrderingCriteria<any>[] {
        return (this.dataTableComponent as any).ordering;
    }

    public checkSorting(firstNRows: number = this.table.data.length, criterium?: OrderingCriteria<any>): void {
        let ordering: OrderingCriteria<any>[];
        if (criterium) {
            ordering = [criterium].concat((this.dataTableComponent as any)._defaultOrdering);
        } else {
            ordering = this.currentOrdering;
        }
        for (let i = 1; i < Math.min(this.table.data.length, firstNRows); i++) {
            ordering.some((criteria: OrderingCriteria<any>) => {
                //noinspection EqualityComparisonWithCoercionJS
                if (criteria.get(this.table.data[i - 1]) != null && criteria.get(this.table.data[i]) != null) {
                    if (criteria.descending) {
                        expect(criteria.get(this.table.data[i - 1]) >= criteria.get(this.table.data[i]))
                            .toBeTruthy('Expect: ' + criteria.get(this.table.data[i - 1]) + ' >= '
                                + criteria.get(this.table.data[i]))
                    } else {
                        expect(criteria.get(this.table.data[i - 1]) <= criteria.get(this.table.data[i]))
                            .toBeTruthy('Expect: ' + criteria.get(this.table.data[i - 1]) + ' <= '
                                + criteria.get(this.table.data[i]))
                    }
                    return criteria.get(this.table.data[i - 1]) !== criteria.get(this.table.data[i]);
                }
                return false;
            });
        }
    }
}

export class SortingHandle {

    constructor(private page: {detectChanges: () => void}, private handle: DebugElement) {
    }

    public click() {
        click(this.handle);
        this.page.detectChanges();
    }
}

export class TableBody {

    constructor(private page: {detectChanges: () => void}, private tableElement: DebugElement) {
    }


    public get tableBodyElement(): DebugElement {
        return this.tableElement.query(By.css('tbody'));
    }

    public get tableRowElements(): DebugElement[] {
        return this.tableBodyElement.queryAll(de => de.references['masterRow']);
    }

    public expandRow(index: number): void {
        click(this.tableRowElements[index]);
        this.page.detectChanges();
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
}

export class RecordsCount {

    constructor(private debugElement: DebugElement) {
    }

    public get element(): DebugElement {
        return this.debugElement.query(By.css('.panel-footer'));
    }

    public get message(): string {
        return this.element.nativeElement.textContent;
    }
}

export class Pager {

    constructor(private tableElement: DebugElement, private page: {detectChanges: () => void}) {
    }

    public get debugElement(): DebugElement {
        return this.tableElement.query(By.directive(PagingComponent));
    }

    public get pageButtons(): DebugElement[] {
        return this.debugElement.queryAll(By.css('li'));
    }

    public expectLeadingButtonsDisabled() {
        for (let i = 0; i < 2; i++) {
            expect(this.pageButtons[i].nativeElement.classList).toContain('disabled', 'First two are disabled.');
        }
    }

    public expectLeadingButtonsNotDisabled() {
        for (let i = 0; i < 2; i++) {
            expect(this.pageButtons[i].nativeElement.classList).not.toContain('disabled', 'First two are not disabled.');
        }
    }

    public expectTrailingButtonsDisabled() {
        for (let i = this.pageButtons.length - 1; i > this.pageButtons.length - 3; i--) {
            expect(this.pageButtons[i].nativeElement.classList).toContain('disabled', 'Last two are disabled.');
        }
    }

    public expectTrailingButtonsNotDisabled() {
        for (let i = this.pageButtons.length - 1; i > this.pageButtons.length - 3; i--) {
            expect(this.pageButtons[i].nativeElement.classList).not.toContain('disabled', 'Last two are not disabled.');
        }
    }

    public expectButtonNumbers(numbers: number[]) {
        for (let i = 0; i < numbers.length; i++) {
            expect(this.pageButtons[i + 2].query(By.css('a')).nativeElement.textContent)
                .toEqual(numbers[i] + '', 'Button numbers are correct');
        }
    }

    public expectButtonActive(index: number) {
        expect(this.pageButtons[index].nativeElement.classList).toContain('active', 'Button is active.');
    }

    public click(index: number) {
        click(this.pageButtons[index]);
        this.page.detectChanges();
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
        <ng-template let-record="row" cell-template>
            {{record.value1}}
        </ng-template>
    </column>
    <column>
        <ng-template let-record="row" cell-template>
            <row-detail-expander></row-detail-expander>
        </ng-template>
        <ng-template let-footer="footer" footer-template>
            {{footer.value1}}
        </ng-template>
    </column>
    <!-- Sub detail -->
    <row-detail>
        <column-group>
            <column title="Test Detail Column 1"
                    [sortingKey]="valueGetter">
                <ng-template let-record="row" cell-template>
                    {{record.value1}}
                </ng-template>
            </column>
        </column-group>
        <column-group>
            <column title="Test Detail Column 2">
                <ng-template let-record="row" cell-template>
                    {{record.value2}}
                </ng-template>
            </column>
            <column title="Test Detail Column 3">
                <ng-template let-record="row" cell-template>
                    {{record.value3}}
                </ng-template>
            </column>
        </column-group>
        <column-group></column-group>
    </row-detail>
</data-table>`
})
export class TestHostComponent {

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
