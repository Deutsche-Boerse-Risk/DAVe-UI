import {DecimalPipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {InitialLoadComponent} from './initial.load.component';
import {NoDataComponent} from './no.data.component';
import {UpdateFailedComponent} from './update.failed.component';

import {GoogleChart} from './google.chart.component';

import {DownloadMenuComponent} from './download.menu.component';

import {BreadCrumbsComponent} from './bread.crumbs.component';

import {NullPipe} from './null.pipe';

import {DataTableComponent} from './datatable/data.table.component';
import {DataTableColumnDirective} from './datatable/data.table.column.directive';
import {DataTableColumnCellDirective} from './datatable/data.table.column.cell.directive';
import {DataTableColumnFooterDirective} from './datatable/data.table.column.footer.directive';
import {DataTableRowDetailDirective} from './datatable/data.table.row.detail.directive';
import {PagingComponent} from './datatable/paging.component';

export const NUMBER_PIPE = new DecimalPipe(navigator.language.split('-')[0]);

@NgModule({
    imports: [
        BrowserModule,
        RouterModule
    ],
    declarations: [
        GoogleChart,
        DownloadMenuComponent,
        BreadCrumbsComponent,
        DataTableComponent,
        DataTableColumnDirective,
        DataTableColumnCellDirective,
        DataTableColumnFooterDirective,
        DataTableRowDetailDirective,
        PagingComponent,
        InitialLoadComponent,
        NoDataComponent,
        UpdateFailedComponent,
        NullPipe
    ],
    exports: [
        GoogleChart,
        DownloadMenuComponent,
        BreadCrumbsComponent,
        DataTableComponent,
        DataTableColumnDirective,
        DataTableColumnCellDirective,
        DataTableColumnFooterDirective,
        DataTableRowDetailDirective,
        InitialLoadComponent,
        NoDataComponent,
        UpdateFailedComponent,
        NullPipe
    ]
})
export class CommonModule {
}