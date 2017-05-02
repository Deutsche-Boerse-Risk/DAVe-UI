import {Component, Input, OnChanges, QueryList, ContentChildren, SimpleChanges} from '@angular/core';

import {DataTableColumnDirective, OrderingValueGetter, OrderingCriteria} from './data.table.column.directive';
import {DataTableRowDetailDirective} from './data.table.row.detail.directive';
import {DataTableColumnGroupDirective} from './data.table.column.group.directive';

import {DataTableDefinition, DataTableCell, DataTableUtils} from './data.table.utils';

export class Row {

    public expanded: boolean;

    constructor(public rowData: any) {
    }

    public toogle(): void {
        this.expanded = !this.expanded;
    }
}

@Component({
    moduleId   : module.id,
    selector   : 'data-table',
    templateUrl: 'data.table.component.html',
    styleUrls  : [
        '../component.css',
        'data.table.component.css'
    ]
})
export class DataTableComponent implements OnChanges {

    public _data: any[];
    public _rows: Row[];

    @Input()
    public footer: any;

    @Input()
    public pageSize: number;

    private _defaultOrdering: OrderingCriteria<any>[];

    @Input()
    public striped: boolean = true;

    @Input()
    public showFooter: boolean = true;

    @Input()
    public trackByRowKey: (index: number, row: any) => any;

    public pageRows: Row[];

    public highlighterStorage: any = {};

    private currentPage: number = 1;

    private ordering: OrderingCriteria<any>[];

    private descending: boolean;
    private sortingKey: OrderingCriteria<any>;

    public ngOnChanges(changes: SimpleChanges): void {
        this.sort();
    }

    public updatePage(page: number): void {
        if (!this._rows) {
            return;
        }

        this.currentPage = page;
        if (!this.pageSize) {
            this.pageRows = this._rows;
            return;
        }

        let lastPage = Math.ceil(this._rows.length / this.pageSize);
        if (page > lastPage) {
            page = lastPage;
        }
        let firstIndex = (page - 1) * this.pageSize;
        let lastIndex = page * this.pageSize;
        this.pageRows = this._rows.slice(firstIndex, lastIndex);
    }

    @Input()
    public set data(data: any[]) {
        if (!data) {
            delete this._data;
            delete this._rows;
            return;
        }

        // Remember old data
        let oldData: { [key: string]: { rowData: any, row: Row } } = {};
        if (this._data && this._rows && this.trackByRowKey) {
            this._data.forEach((value: any, index: number) => {
                oldData[this.trackByRowKey(index, value)] = {
                    rowData: value,
                    row    : this._rows[index]
                };
            });
            delete this._data;
        }
        this._data = [];
        this._rows = [];

        // Merge the new and old data into old array so angular is able to do change detection correctly
        for (let index = 0; index < data.length; ++index) {
            let newValue = data[index];
            let oldValue: { rowData: any, row: Row };
            if (this.trackByRowKey && oldData) {
                oldValue = oldData[this.trackByRowKey(index, newValue)];
            }
            if (oldValue) {
                this._data.push(oldValue.rowData);
                Object.keys(oldValue.rowData).concat(Object.keys(newValue)).forEach((key: string) => {
                    (<any>oldValue.rowData)[key] = (<any>newValue)[key];
                });
                this._rows.push(oldValue.row);
            } else {
                this._data.push(newValue);
                this._rows.push(new Row(newValue));
            }
        }
        oldData = null;
    }

    public get data(): any[] {
        return this._data;
    }

    @Input()
    public set defaultOrdering(value: (OrderingCriteria<any> | OrderingValueGetter<any>)[]) {
        this._defaultOrdering = [];
        if (value) {
            value.forEach((criteria: OrderingCriteria<any> | OrderingValueGetter<any>) => {
                if (typeof criteria === 'function') {
                    this._defaultOrdering.push({
                        get       : criteria,
                        descending: false
                    });
                } else {
                    criteria.descending = !!criteria.descending;
                    this._defaultOrdering.push(criteria);
                }
            });
        }
    }

    public sortRecords(sortingKey: OrderingCriteria<any>): void {
        this.ordering = this.ordering || [];

        if (this.sortingKey !== sortingKey) {
            this.sortingKey = sortingKey;
            this.descending = !sortingKey.descending;
        }

        let defaultOrdering = this._defaultOrdering || [];

        this.descending = !this.descending;
        this.ordering = [
            <OrderingCriteria<any>>{
                get       : this.sortingKey.get,
                descending: this.descending
            }
        ].concat(defaultOrdering);

        this.sort();
    }

    private sort(): void {
        if (!this._rows) {
            return;
        }

        if (!this.ordering) {
            this.ordering = this._defaultOrdering;
        }

        if (!this.ordering) {
            this.ordering = [];
        }

        this._rows.sort((a: Row, b: Row) => {
            let comp: number = 0;
            this.ordering.some((sortingKey: OrderingCriteria<any>) => {
                let direction = sortingKey.descending ? -1 : 1;
                let first = sortingKey.get(a.rowData);
                let second = sortingKey.get(b.rowData);

                if (first < second) {
                    comp = -1 * direction;
                }
                if (first > second) {
                    comp = direction;
                }

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
            if (rowDetailTableDefinitions.length) {
                DataTableUtils.fixColspans(rowDetailTableDefinitions, maxColspan);

                this.rowDetailTableDefinitions = rowDetailTableDefinitions;
            } else {
                delete this.rowDetailTableDefinitions;
            }
        }
        return this.rowDetailTableDefinitions;
    }

    public trackByIndex(index: number): number {
        return index;
    }

    //</editor-fold>
}

