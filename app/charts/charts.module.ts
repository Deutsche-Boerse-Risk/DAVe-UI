import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MaterialModule} from '../material/material.module';

import {GoogleChart} from './google.chart.component';
import {GoogleLineChart} from './google.line.chart.component';

@NgModule({
    imports: [
        BrowserModule,
        MaterialModule
    ],
    declarations: [
        GoogleChart,
        GoogleLineChart
    ],
    exports: [
        GoogleChart,
        GoogleLineChart
    ]
})
export class ChartsModule {
}