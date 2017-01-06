import {DecimalPipe, DatePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {DataTableModule} from './datatable/data.table.module';

import {InitialLoadComponent} from './initial.load.component';
import {NoDataComponent} from './no.data.component';
import {UpdateFailedComponent} from './update.failed.component';

import {GoogleChart} from './google.chart.component';

import {DownloadMenuComponent} from './download.menu.component';

import {BreadCrumbsComponent} from './bread.crumbs.component';

import {FilterComponent} from './filter.component';

import {NullPipe} from './null.pipe';

export const NUMBER_PIPE = new DecimalPipe(navigator.language.split('-')[0]);

export const DATE_PIPE = new DatePipe(navigator.language.split('-')[0]);

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        FormsModule,
        DataTableModule
    ],
    declarations: [
        GoogleChart,
        DownloadMenuComponent,
        BreadCrumbsComponent,
        InitialLoadComponent,
        NoDataComponent,
        UpdateFailedComponent,
        FilterComponent,
        NullPipe
    ],
    exports: [
        GoogleChart,
        DownloadMenuComponent,
        BreadCrumbsComponent,
        InitialLoadComponent,
        NoDataComponent,
        UpdateFailedComponent,
        FilterComponent,
        NullPipe,
        DataTableModule
    ]
})
export class CommonModule {
}