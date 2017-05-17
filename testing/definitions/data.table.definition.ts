import {Component, DebugElement, DebugNode} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {MdAnchor, MdButton, MdButtonToggle, MdIcon, MdTooltip} from '@angular/material';

import {OrderingValueGetter, OrderingCriteria} from '../../app/datatable/data.table.column.directive';
import {DataTableComponent} from '../../app/datatable/data.table.component';
import {DataTableRowDetailExpander} from '../../app/datatable/data.table.row.detail.expander.component';
import {PagingComponent} from '../../app/datatable/paging.component';
import {HIGHLIGHTER_CLASS} from '../../app/datatable/highlighter.directive';

import {click} from '../events';
import {Page} from './page.base';

export class DataTableDefinition {

    constructor(public debugElement: DebugElement, private page: { detectChanges: () => void }) {
    }

    public get component(): DataTableComponent {
        return this.debugElement.componentInstance;
    }

    public get data(): any[] {
        return this.component.plainData;
    }

    public get element(): DebugElement {
        return this.debugElement.query(By.css('.tableWrapper > table'));
    }

    public get header(): TableHeader {
        return new TableHeader(this.debugElement.query(de => de.references['mainHeader']), this.page);
    }

    public get sorting(): TableSorting {
        return new TableSorting(this, this.page);
    }

    public get body(): TableBody {
        return new TableBody(this.debugElement.query(de => de.references['mainBody']), this.page);
    }

    public get footer(): TableFooter {
        return new TableFooter(this.debugElement.query(de => de.references['mainFooter']));
    }

    public get recordsCount(): RecordsCount {
        return new RecordsCount(this.debugElement.query(By.css('.pageCount')));
    }

    public get pager(): Pager {
        return new Pager(this.debugElement.query(By.directive(PagingComponent)), this.page);
    }
}

//<editor-fold defaultstate="collapsed" desc="Table header">

export class TableHeader {

    constructor(public element: DebugElement, private page: { detectChanges: () => void }) {
    }

    public get rows(): TableHeaderRow[] {
        return this.element.queryAll(By.css('tr')).map((element: DebugElement) => {
            return new TableHeaderRow(element, this.page);
        });
    }

    public get cells(): TableHeaderCell[] {
        return this.element.queryAll(By.css('th')).map((element: DebugElement) => {
            return new TableHeaderCell(element, this.page);
        });
    }

}

export class TableHeaderRow {
    constructor(public element: DebugElement, private page: { detectChanges: () => void }) {
    }

    public get cells(): TableHeaderCell[] {
        return this.element.queryAll(By.css('th')).map((element: DebugElement) => {
            return new TableHeaderCell(element, this.page);
        });
    }
}

export class TableHeaderCell {

    constructor(public element: DebugElement, private page: { detectChanges: () => void }) {
    }

    public get sortingHandle(): SortingHandle {
        let handle = this.element.query(By.directive(MdButton));
        if (handle) {
            return new SortingHandle(this.page, handle);
        }
        return null;
    }

    public get tooltip(): string {
        let handle = this.element.query(By.directive(MdTooltip));
        if (handle) {
            return handle.injector.get(MdTooltip).message;
        }
        return null;
    }

    public get title(): string {
        return this.element.childNodes.find((node: DebugNode) => node.nativeNode.nodeType === Node.TEXT_NODE)
            .nativeNode.textContent.trim();
    }

    public get colspan(): number {
        return this.element.nativeElement.colspan;
    }

    public get rowspan(): number {
        return this.element.nativeElement.rowspan;
    }

}

//<editor-fold defaultstate="collapsed" desc="Sorting">

export class TableSorting {

    constructor(private table: DataTableDefinition, private page: { detectChanges: () => void }) {
    }

    public get handles(): SortingHandle[] {
        let handles = this.table.debugElement.query(de => de.references['mainHeader']).queryAll(By.directive(MdButton));
        if (!handles) {
            return null;
        }
        return handles.map((handle: DebugElement) => {
            return new SortingHandle(this.page, handle);
        });
    }

    public get detailRowHandles(): SortingHandle[] {
        let handles = this.table.debugElement.query(By.css('.detail')).query(By.css('thead'))
            .queryAll(By.directive(MdButton));
        if (!handles) {
            return null;
        }
        return handles.map((handle: DebugElement) => {
            return new SortingHandle(this.page, handle);
        });
    }

    public get currentOrdering(): OrderingCriteria<any>[] {
        return (this.table.component as any).ordering;
    }

    public checkSorting(firstNRows: number = this.table.data.length, criterium?: OrderingCriteria<any>): void {
        let ordering: OrderingCriteria<any>[];
        if (criterium) {
            ordering = [criterium].concat((this.table.component as any)._defaultOrdering);
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
                                + criteria.get(this.table.data[i]));
                    } else {
                        expect(criteria.get(this.table.data[i - 1]) <= criteria.get(this.table.data[i]))
                            .toBeTruthy('Expect: ' + criteria.get(this.table.data[i - 1]) + ' <= '
                                + criteria.get(this.table.data[i]));
                    }
                    return criteria.get(this.table.data[i - 1]) !== criteria.get(this.table.data[i]);
                }
                return false;
            });
        }
    }
}

export class SortingHandle {

    constructor(private page: { detectChanges: () => void }, private handle: DebugElement) {
    }

    public click() {
        click(this.handle);
        this.page.detectChanges();
    }
}

// </editor-fold>

// </editor-fold>

//<editor-fold defaultstate="collapsed" desc="Table body">

export class TableBody {

    constructor(public element: DebugElement, private page: { detectChanges: () => void }) {
    }

    public get rows(): TableBodyRow[] {
        return this.element.queryAll(de => de.references['masterRow']).map((element: DebugElement) => {
            return new TableBodyRow(element, this.page);
        });
    }

    public get cells(): TableBodyCell[] {
        let cells: TableBodyCell[] = [];
        this.element.queryAll(de => de.references['masterRow']).forEach((element: DebugElement) => {
            cells = cells.concat(element.queryAll(By.css('td')).map((element: DebugElement) => {
                return new TableBodyCell(element);
            }));
        });
        return cells;
    }
}

export class TableBodyRow {

    constructor(public element: DebugElement, private page: { detectChanges: () => void }) {
    }

    public expandRow(): void {
        click(this.element);
        this.page.detectChanges();
    }

    public get expander(): RowExpander {
        return new RowExpander(
            this.element.query(By.directive(DataTableRowDetailExpander)).query(By.directive(MdAnchor)));
    }

    public get cells(): TableBodyCell[] {
        return this.element.queryAll(By.css('td')).map((element: DebugElement) => {
            return new TableBodyCell(element);
        });
    }

    public get rowDetail(): TableBodyDetail {
        let next = this.element.parent.children[this.element.parent.children.indexOf(this.element) + 1];
        if (next && !next.references['masterRow']) {
            return new TableBodyDetail(next, this.page);
        }
        return null;
    }

    public get highlighted(): boolean {
        return this.element.nativeElement.classList.contains(HIGHLIGHTER_CLASS);
    }
}

export class RowExpander {
    constructor(public element: DebugElement) {
    }

    public get icon(): string {
        return this.element.query(By.directive(MdIcon)).nativeElement.textContent.trim();
    }

    public get opened(): boolean {
        return this.icon === 'expand_less';
    }

    public get closed(): boolean {
        return this.icon === 'expand_more';
    }
}

export class TableBodyCell {

    constructor(public element: DebugElement) {
    }

    public get colspan(): number {
        return this.element.nativeElement.colspan;
    }

    public get rowspan(): number {
        return this.element.nativeElement.rowspan;
    }
}

//<editor-fold defaultstate="collapsed" desc="Row detail">

export class TableBodyDetail {

    constructor(public element: DebugElement, private page: { detectChanges: () => void }) {
    }

    public header(): TableHeader {
        return new TableHeader(this.element.query(By.css('thead')), this.page);
    }

    public get body(): TableBodyDetailBody {
        return new TableBodyDetailBody(this.element.query(By.css('tbody')));
    }

    public get highlighted(): boolean {
        return this.element.nativeElement.classList.contains(HIGHLIGHTER_CLASS);
    }

    public get colspan(): number {
        return this.element.children[0].nativeElement.colspan;
    }
}

export class TableBodyDetailBody {

    constructor(public element: DebugElement) {
    }

    public get rows(): TableBodyDetailRow[] {
        return this.element.queryAll(By.css('tr')).map((element: DebugElement) => {
            return new TableBodyDetailRow(element);
        });
    }

    public get cells(): TableBodyCell[] {
        let cells: TableBodyCell[] = [];
        this.element.queryAll(By.css('tr')).forEach((element: DebugElement) => {
            cells = cells.concat(element.queryAll(By.css('td')).map((element: DebugElement) => {
                return new TableBodyCell(element);
            }));
        });
        return cells;
    }
}

export class TableBodyDetailRow {

    constructor(public element: DebugElement) {
    }

    public get cells(): TableBodyCell[] {
        return this.element.queryAll(By.css('td')).map((element: DebugElement) => {
            return new TableBodyCell(element);
        });
    }
}

// </editor-fold>

// </editor-fold>

//<editor-fold defaultstate="collapsed" desc="Table footer">

export class TableFooter {

    constructor(public element: DebugElement) {
    }

    public get rows(): TableFooterRow[] {
        return this.element.queryAll(By.css('tr')).map((element: DebugElement) => {
            return new TableFooterRow(element);
        });
    }

    public get cells(): TableBodyCell[] {
        let cells: TableBodyCell[] = [];
        this.element.queryAll(By.css('tr')).forEach((element: DebugElement) => {
            cells = cells.concat(element.queryAll(By.css('th')).map((element: DebugElement) => {
                return new TableBodyCell(element);
            }));
        });
        return cells;
    }
}

export class TableFooterRow {

    constructor(public element: DebugElement) {
    }

    public get cells(): TableBodyCell[] {
        return this.element.queryAll(By.css('th')).map((element: DebugElement) => {
            return new TableBodyCell(element);
        });
    }
}

// </editor-fold>

export class RecordsCount {

    constructor(public element: DebugElement) {
    }

    public get message(): string {
        return this.element.nativeElement.textContent;
    }
}

export class Pager {

    constructor(public element: DebugElement, private page: { detectChanges: () => void }) {
    }

    public get pageButtons(): DebugElement[] {
        return this.element.queryAll(By.directive(MdButtonToggle));
    }

    public expectLeadingButtonsDisabled() {
        for (let i = 0; i < 2; i++) {
            expect(this.pageButtons[i].classes['mat-button-toggle-disabled'])
                .toBeTruthy('First two are disabled.');
        }
    }

    public expectLeadingButtonsNotDisabled() {
        for (let i = 0; i < 2; i++) {
            expect(this.pageButtons[i].classes['mat-button-toggle-disabled'])
                .not.toBeTruthy('First two are not disabled.');
        }
    }

    public expectTrailingButtonsDisabled() {
        for (let i = this.pageButtons.length - 1; i > this.pageButtons.length - 3; i--) {
            expect(this.pageButtons[i].classes['mat-button-toggle-disabled'])
                .toBeTruthy('Last two are disabled.');
        }
    }

    public expectTrailingButtonsNotDisabled() {
        for (let i = this.pageButtons.length - 1; i > this.pageButtons.length - 3; i--) {
            expect(this.pageButtons[i].classes['mat-button-toggle-disabled'])
                .not.toBeTruthy('Last two are not disabled.');
        }
    }

    public expectButtonNumbers(numbers: number[]) {
        for (let i = 0; i < numbers.length; i++) {
            expect(this.pageButtons[i + 2].query(By.css('.mat-button-toggle-label-content'))
                .nativeElement.textContent.trim())
                .toEqual(numbers[i] + '', 'Button numbers are correct');
        }
    }

    public expectButtonActive(index: number) {
        expect(this.pageButtons[index].classes['mat-button-toggle-checked'])
            .toBeTruthy('Button is active.');
    }

    public click(index: number) {
        click(this.pageButtons[index].query(By.css('.mat-button-toggle-label-content')).nativeElement);
        this.page.detectChanges();
    }
}

export class DataTableDefinitionHosted extends Page<TestHostComponent> {

    constructor(fixture: ComponentFixture<TestHostComponent>) {
        super(fixture);
    }

    public get dataTable(): DataTableDefinition {
        return new DataTableDefinition(this.debugElement.query(By.directive(DataTableComponent)), this);
    }

    public detectChanges(millis: number = 0): void {
        super.detectChanges(millis);
        // Check again as the table changes may change something in the pager as well.
        super.detectChanges();
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
                <ng-template let-record="row" let-expanded="expanded" cell-template>
                    <row-detail-expander [expanded]="expanded"></row-detail-expander>
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
            });
        }
        this.footer = this.data[0];
    }

    public get defaultOrdering(): (OrderingCriteria<any> | OrderingValueGetter<any>)[] {
        return [
            {
                get       : (record: any) => {
                    return record.value3;
                },
                descending: true
            },
            (record: any) => {
                return record.value2;
            }
        ];
    }

    public get valueGetter(): (record: any) => any {
        return (record: any) => {
            return record.value1;
        };
    }
}
