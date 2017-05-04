import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {CommonModule} from '../common/common.module';
import {MaterialModule} from '../material/material.module';

import {DownloadMenuComponent} from './download.menu.component';
import {BreadCrumbsComponent} from './bread.crumbs.component';
import {ListComponent} from './list.component';
import {DrillUpDownButtonComponent} from './drill.updown.button.component';

@NgModule({
    imports     : [
        BrowserModule,
        RouterModule,
        FormsModule,
        CommonModule,
        MaterialModule
    ],
    declarations: [
        ListComponent,
        DownloadMenuComponent,
        BreadCrumbsComponent,
        DrillUpDownButtonComponent
    ],
    exports     : [
        ListComponent
    ]
})
export class ListModule {
}