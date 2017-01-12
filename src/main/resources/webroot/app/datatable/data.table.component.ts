import {Component, Input, OnChanges, QueryList, ContentChildren, SimpleChanges} from '@angular/core';

import {DataTableColumnDirective} from './data.table.column.directive';
import {DataTableRowDetailDirective} from './data.table.row.detail.directive';
import {DataTableColumnGroupDirective} from './data.table.column.group.directive';

import {DataTableDefinition, DataTableCell, DataTableUtils} from './data.table.utils';

@Component({
    moduleId: module.id,
    selector: 'data-table',
    templateUrl: 'data.table.component.html',
    styleUrls: ['../common.component.css']
})
export class DataTableComponent implements OnChanges {

    @Input()
    public data: any[];

    @Input()
    public footer: any;

    @Input()
    public pageSize: number;

    @Input()
    public defaultOrdering: string[];

    @Input()
    public striped: boolean = true;

    @Input()
    public showFooter: boolean = true;

    public pageRows: any[];

    private currentPage: number = 1;

    private ordering: string[];

    public ngOnChanges(changes: SimpleChanges): void {
        this.sort();
    }

    public updatePage(page: number) {
        if (!this.data) {
            return;
        }

        this.currentPage = page;
        if (!this.pageSize) {
            this.pageRows = this.data;
            return;
        }
        let firstIndex = (page - 1) * this.pageSize;
        let lastIndex = page * this.pageSize;
        this.pageRows = this.data.slice(firstIndex, lastIndex);
    }

    public sortRecords(sortingKey: string): void {
        if (!this.ordering) {
            this.ordering = [];
        }

        let defaultOrdering = this.defaultOrdering;
        if (!defaultOrdering) {
            defaultOrdering = [];
        }

        if (this.ordering[0] == sortingKey) {
            this.ordering = ['-' + sortingKey].concat(defaultOrdering);
        } else {
            this.ordering = [sortingKey].concat(defaultOrdering);
        }
        this.sort();
    }

    private sort(): void {
        if (!this.data) {
            return;
        }

        if (!this.ordering) {
            this.ordering = this.defaultOrdering;
        }

        if (!this.ordering) {
            this.ordering = [];
        }

        this.data.sort((a: any, b: any) => {
            let comp: number = 0;
            this.ordering.some((sortingKey: string) => {
                let direction = 1;
                if (sortingKey.startsWith('-')) {
                    sortingKey = sortingKey.slice(1);
                    direction = -1
                }
                let first = a[sortingKey];
                let second = b[sortingKey];

                if (first < second) {
                    comp = -1 * direction;
                }
                if (first > second)
                    comp = direction;

                return comp !== 0;

            });
            return comp;
        });
        this.updatePage(this.currentPage);
    }

    //<editor-fold defaultstate="collapsed" desc="Template processing">

    @ContentChildren(DataTableRowDetailDirective, {descendants: false})
    public _rowDetailTemplate: QueryList<DataTableRowDetailDirective>;

    @ContentChildren(DataTableColumnDirective, {descendants: false})
    public _columnTemplates: QueryList<DataTableColumnDirective>;

    private _tableDefinition: DataTableDefinition;

    private rowDetailTableDefinitions: DataTableDefinition[];

    private get tableDefinition(): DataTableDefinition {
        if (this._columnTemplates && !this._tableDefinition) {
            this._tableDefinition = DataTableUtils.computeSpans(this._columnTemplates.toArray());
        }
        return this._tableDefinition;
    }

    public get headerTemplates(): DataTableCell[][] {
        return this.tableDefinition.headerTemplates;
    }

    public get rowsTemplates(): DataTableCell[][] {
        return this.tableDefinition.rowsTemplates;
    }

    public get footerTemplates(): DataTableCell[][] {
        return this.tableDefinition.footerTemplates;
    }

    public get detailRowColspan(): number {
        return DataTableUtils.getColumnsCountForTemplate(this.tableDefinition);
    }

    public get detailRowGroups(): DataTableDefinition[] {
        if (this._rowDetailTemplate && this._rowDetailTemplate.first && !this.rowDetailTableDefinitions) {
            let detailTemplate: DataTableRowDetailDirective = this._rowDetailTemplate.first;
            let rowDetailTableDefinitions: DataTableDefinition[] = [];
            let maxColspan: number = 0;
            detailTemplate.columnGroups.forEach((item: DataTableColumnGroupDirective) => {
                let definition: DataTableDefinition = DataTableUtils.computeSpans(item.columns.toArray());
                maxColspan = Math.max(maxColspan, DataTableUtils.getColumnsCountForTemplate(definition));
                rowDetailTableDefinitions.push(definition);
            });
            if (!rowDetailTableDefinitions.length) {
                delete this.rowDetailTableDefinitions;
            } else {
                DataTableUtils.fixColspans(rowDetailTableDefinitions, maxColspan);

                this.rowDetailTableDefinitions = rowDetailTableDefinitions;
            }
        }
        return this.rowDetailTableDefinitions;
    }

    //</editor-fold>
}

