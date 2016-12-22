import {PipeTransform} from '@angular/core';

export interface DataTableColumn {
    title?: string;
    tooltip?: string;
    sortingKey?: string;
}

export type DataTableHeader = DataTableColumn[];

export interface DataTableRows<T> {
    cells: DataTableCell[];
    data?: T[];
}

export interface DataTableCell {
    titleKey?: string;
    routerLink?: string[];
    pipe?: PipeTransform;
    pipeArgs?: string;
}

export type DataTableFooter<T> = DataTableRows<T>;

export interface DataTable<T> {
    header?: DataTableHeader;
    rows?: DataTableRows<T>;
    footer?: DataTableFooter<T>;
    pageSize?: number;
    defaultOrdering?: string[];
}