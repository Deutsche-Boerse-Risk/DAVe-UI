import {DatePipe, DecimalPipe} from '@angular/common';
import {NgModule, Inject, InjectionToken} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MaterialModule} from '../material/material.module';

import {MessageComponent} from './message.component';
import {RemoveDialogComponent} from './remove.dialog.component';

import {PercentPipe} from './percent.pipe';

export const DATE_FORMAT = new InjectionToken<string>('dave.dateFormat');

export class DateFormatter {

    constructor(@Inject(DATE_FORMAT) private format: string, private datePipe: DatePipe) {
    }

    public transform(value: Date): string {
        return this.datePipe.transform(value, this.format);
    }
}

@NgModule({
    imports        : [
        BrowserModule,
        MaterialModule
    ],
    declarations   : [
        MessageComponent,
        RemoveDialogComponent,
        PercentPipe
    ],
    exports        : [
        MessageComponent,
        RemoveDialogComponent,
        PercentPipe
    ],
    entryComponents: [
        RemoveDialogComponent
    ],
    providers      : [
        DecimalPipe,
        DatePipe,
        DateFormatter,
        {
            provide : DATE_FORMAT,
            useValue: 'dd. MM. yyyy HH:mm:ss'
        }
    ]
})
export class CommonModule {
}