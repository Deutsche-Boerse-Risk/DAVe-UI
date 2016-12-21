import {PipeTransform} from "@angular/core";

export interface DataTableColumn {
    title?: string;
    tooltip?: string;
    sortingKey?: string;
}

export interface DataTableRow {
    cells: DataTableCell[];
    data: any;
}

export interface DataTableCell {
    titleKey?: string;
    routerLink?: any[];
    pipe?: PipeTransform;
    pipeArgs?: string;
}

export type DataTableFooter = DataTableRow;