import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {CommonViewModule} from '@dbg-riskit/dave-ui-view';
import {FileModule} from '@dbg-riskit/dave-ui-file';

import {ListComponent} from './list.component';
import {BreadCrumbsComponent} from './bread.crumbs.component';
import {DetailRowButtonComponent} from './detail.row.button.component';
import {DrillUpDownButtonComponent} from './drill.updown.button.component';
import {DrillDownRowButtonComponent} from './drill.down.row.button.component';

@NgModule({
    imports     : [
        BrowserModule,
        RouterModule,
        FormsModule,
        CommonViewModule,
        FileModule
    ],
    declarations: [
        ListComponent,
        BreadCrumbsComponent,
        DetailRowButtonComponent,
        DrillUpDownButtonComponent,
        DrillDownRowButtonComponent
    ],
    exports     : [
        ListComponent,
        DetailRowButtonComponent,
        DrillDownRowButtonComponent
    ]
})
export class ListModule {
}