import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {DataTableComponent} from './data.table.component';

import {DataTableColumnDirective} from './data.table.column.directive';
import {DataTableColumnGroupDirective} from './data.table.column.group.directive';
import {DataTableColumnCellDirective} from './data.table.column.cell.directive';
import {DataTableColumnFooterDirective} from './data.table.column.footer.directive';
import {DataTableRowDetailDirective} from './data.table.row.detail.directive';

import {PagingComponent} from './paging.component';

import {DataTableRowDetailExpander} from './data.table.row.detail.expander.component';
import {DataTableExpandableDirective} from './data.table.expandable.directive';

import {DrillDownRowButtonComponent} from './drill.down.row.button.component';
import {DetailRowButtonComponent} from './detail.row.button.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule
    ],
    declarations: [
        DataTableComponent,
        DataTableColumnDirective,
        DataTableColumnGroupDirective,
        DataTableColumnCellDirective,
        DataTableColumnFooterDirective,
        DataTableRowDetailDirective,
        DataTableRowDetailExpander,
        DataTableExpandableDirective,
        PagingComponent,
        DrillDownRowButtonComponent,
        DetailRowButtonComponent
    ],
    exports: [
        DataTableComponent,
        DataTableColumnDirective,
        DataTableColumnGroupDirective,
        DataTableColumnCellDirective,
        DataTableColumnFooterDirective,
        DataTableRowDetailDirective,
        DataTableRowDetailExpander,
        DrillDownRowButtonComponent,
        DetailRowButtonComponent
    ]
})
export class DataTableModule {
}