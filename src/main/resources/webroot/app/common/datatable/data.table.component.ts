import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";

import {DataTableRow, DataTableColumn, DataTableFooter, DataTableCell} from "./data.table.types";

@Component({
    moduleId: module.id,
    selector: 'data-table',
    templateUrl: 'data.table.component.html',
    styleUrls: ['data.table.component.css']
})
export class DataTableComponent implements OnChanges {

    @Input()
    public headerColumns: DataTableColumn[];

    @Input()
    public rows: DataTableRow[];

    public pageRows: DataTableRow[];

    @Input()
    public footerRows: DataTableFooter[];

    @Input()
    public pageSize: number;

    private currentPage: number = 1;

    public ngOnChanges(changes: SimpleChanges): void {
        this.updatePage(this.currentPage);
    }

    public updatePage(page: number) {
        if (!this.rows) {
            return;
        }

        this.currentPage = page;
        if (!this.pageSize) {
            this.pageRows = this.rows.slice();
            return;
        }
        let firstIndex = (page - 1) * this.pageSize;
        let lastIndex = page * this.pageSize;
        this.pageRows = this.rows.slice(firstIndex, lastIndex);
    }

    public sortRecords(sortingKey: string): void {
        if (!this.rows) {
            return;
        }

        this.rows.sort((a: DataTableRow, b: DataTableRow) => {
            let first = a.data[sortingKey];
            let second = b.data[sortingKey];

            if (first < second)
                return -1;
            if (first > second)
                return 1;
            return 0;
        });
        this.updatePage(this.currentPage);
    }

    public processTitle(row: DataTableRow, cell: DataTableCell): any {
        if (!cell.titleKey || !row.data) {
            return;
        }

        let title = row.data[cell.titleKey];
        if (!title) {
            return;
        }

        if (cell.pipe) {
            title = cell.pipe.transform(title, cell.pipeArgs);
        }
        return title;
    }
}

