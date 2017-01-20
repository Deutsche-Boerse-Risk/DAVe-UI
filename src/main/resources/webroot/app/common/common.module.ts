import {DecimalPipe, DatePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {InitialLoadComponent} from './initial.load.component';
import {NoDataComponent} from './no.data.component';
import {UpdateFailedComponent} from './update.failed.component';

import {GoogleChart} from './google.chart.component';
import {GoogleLineChart} from './google.line.chart.component';

import {PercentPipe} from './percent.pipe';

export const NUMBER_PIPE = new DecimalPipe(navigator.language.split('-')[0]);

export const DATE_PIPE = new DatePipe(navigator.language.split('-')[0]);

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        GoogleChart,
        GoogleLineChart,
        InitialLoadComponent,
        NoDataComponent,
        UpdateFailedComponent,
        PercentPipe
    ],
    exports: [
        GoogleChart,
        GoogleLineChart,
        InitialLoadComponent,
        NoDataComponent,
        UpdateFailedComponent,
        PercentPipe
    ]
})
export class CommonModule {
}