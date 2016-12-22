import {
    Component, Input, OnChanges, SimpleChanges, DoCheck, KeyValueDiffers, KeyValueDiffer,
    SimpleChange
} from '@angular/core';

import {DataTableRows, DataTableCell, DataTable} from './data.table.types';

@Component({
    moduleId: module.id,
    selector: 'data-table',
    templateUrl: 'data.table.component.html',
    styleUrls: ['data.table.component.css']
})
export class DataTableComponent implements OnChanges, DoCheck {

    @Input()
    public dataTable: DataTable<any>;

    public pageRows: DataTableRows<any>;

    private currentPage: number = 1;

    private ordering: string[];

    private serializedTable: string;

    public ngDoCheck(): void {
        if (!this.dataTable) {
            return;
        }

        if (!this.serializedTable) {
            this.serializedTable = JSON.stringify(this.dataTable);
        } else {
            let oldSerializedTable = this.serializedTable;
            this.serializedTable = JSON.stringify(this.dataTable);
            if (oldSerializedTable.localeCompare(this.serializedTable) !== 0) {
                this.ngOnChanges({
                    dataTable: new SimpleChange(JSON.parse(oldSerializedTable), this.dataTable)
                });
            }
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.sort();
        this.serializedTable = JSON.stringify(this.dataTable);
    }

    public updatePage(page: number) {
        if (!this.dataTable.rows) {
            return;
        }

        this.currentPage = page;
        if (!this.dataTable.pageSize) {
            this.pageRows = this.dataTable.rows;
            return;
        }
        let firstIndex = (page - 1) * this.dataTable.pageSize;
        let lastIndex = page * this.dataTable.pageSize;
        this.pageRows = {
            cells: this.dataTable.rows.cells,
            data: this.dataTable.rows.data.slice(firstIndex, lastIndex)
        };
    }

    public sortRecords(sortingKey: string): void {
        if (!this.ordering) {
            this.ordering = [];
        }

        let defaultOrdering = this.dataTable.defaultOrdering;
        if (!defaultOrdering) {
            defaultOrdering = [];
        }

        if (this.ordering[0] == sortingKey) {
            this.ordering = ["-" + sortingKey].concat(defaultOrdering);
        } else {
            this.ordering = [sortingKey].concat(defaultOrdering);
        }
        this.sort();
    }

    private sort(): void {
        if (!this.dataTable.rows) {
            return;
        }

        if (!this.ordering) {
            this.ordering = this.dataTable.defaultOrdering;
        }

        if (!this.ordering) {
            this.ordering = [];
        }

        this.ordering.slice().reverse().forEach((sortingKey: string) => {
            let direction = 1;
            if (sortingKey.startsWith('-')) {
                sortingKey = sortingKey.slice(1);
                direction = -1
            }
            this.dataTable.rows.data.sort((a: any, b: any) => {
                let first = a[sortingKey];
                let second = b[sortingKey];

                if (first < second)
                    return -1 * direction;
                if (first > second)
                    return 1 * direction;
                return 0;
            });
        });
        this.updatePage(this.currentPage);
    }

    public processTitle(row: any, cell: DataTableCell): any {
        if (!cell.titleKey || !row) {
            return;
        }

        let title = row[cell.titleKey];

        if (cell.pipe) {
            title = cell.pipe.transform(title, cell.pipeArgs);
        }
        return title;
    }

    public processRouterLink(row: any, cell: DataTableCell): string[] {
        if (!cell.routerLink || !row) {
            return;
        }

        let processedLink: string[] = [];

        Object.keys(cell.routerLink).forEach((key: string) => {
            let part = cell.routerLink[key];
            if (part.match(/\{\{.*\}\}/i)) {
                let dataKey = part.slice(2, part.length - 2);
                processedLink.push(row[dataKey]);
            } else {
                processedLink.push(part);
            }
        });

        return processedLink;
    }
}

