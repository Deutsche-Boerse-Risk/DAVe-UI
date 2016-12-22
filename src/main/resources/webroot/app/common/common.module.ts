import {DecimalPipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {InitialLoadComponent} from './initial.load.component';
import {NoDataComponent} from './no.data.component';
import {UpdateFailedComponent} from './update.failed.component';

import {GoogleChart} from './google.chart.component';

import {DataTableComponent} from './datatable/data.table.component';
import {PagingComponent} from './datatable/paging.component';

export const NUMBER_PIPE = new DecimalPipe(navigator.language.split('-')[0]);

@NgModule({
    imports: [
        BrowserModule,
        RouterModule
    ],
    declarations: [
        GoogleChart,
        DataTableComponent,
        PagingComponent,
        InitialLoadComponent,
        NoDataComponent,
        UpdateFailedComponent
    ],
    exports: [
        GoogleChart,
        DataTableComponent,
        InitialLoadComponent,
        NoDataComponent,
        UpdateFailedComponent
    ]
})
export class CommonModule {
}