import {DatePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {InitialLoadComponent} from './initial.load.component';
import {NoDataComponent} from './no.data.component';
import {UpdateFailedComponent} from './update.failed.component';

import {GoogleChart} from './google.chart.component';
import {GoogleLineChart} from './google.line.chart.component';

import {PercentPipe} from './percent.pipe';
export {NUMBER_PIPE} from './percent.pipe';

declare let testLanguage: string;

const DATE_PIPE = new DatePipe(testLanguage || navigator.language.split('-')[0]);

class DateFormatter {

    constructor(private format: string) {
    }

    public transform(value: Date): string {
        return DATE_PIPE.transform(value, this.format);
    }
}

export const DATE_FORMATTER = new DateFormatter('MM. dd. yyyy');
export const DATE_TIME_FORMATTER = new DateFormatter('MM. dd. yyyy HH:mm:ss');
export const TIME_FORMATTER = new DateFormatter('HH:mm:ss');

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