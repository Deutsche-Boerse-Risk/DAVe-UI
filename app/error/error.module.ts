import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {CommonViewModule} from '@dbg-riskit/dave-ui-view';

import {ErrorComponent} from './error.menu.component';
import {ErrorCollectorService} from './error.collector';

@NgModule({
    imports     : [
        BrowserModule,
        CommonViewModule
    ],
    exports     : [
        ErrorComponent
    ],
    declarations: [
        ErrorComponent
    ],
    providers   : [
        ErrorCollectorService
    ]
})
export class ErrorModule {
}