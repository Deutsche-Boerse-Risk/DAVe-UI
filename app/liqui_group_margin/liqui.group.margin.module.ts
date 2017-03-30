import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {CommonModule} from '../common/common.module';
import {DataTableModule} from '../datatable/data.table.module';
import {ListModule} from '../list/list.module';

import {LiquiGroupMarginService} from './liqui.group.margin.service';
import {LiquiGroupMarginLatestComponent} from './liqui.group.margin.latest.component';
import {LiquiGroupMarginHistoryComponent} from './liqui.group.margin.history.component';

@NgModule({
    imports     : [
        BrowserModule,
        RouterModule,
        CommonModule,
        DataTableModule,
        ListModule
    ],
    declarations: [
        LiquiGroupMarginLatestComponent,
        LiquiGroupMarginHistoryComponent
    ],
    exports     : [
        LiquiGroupMarginLatestComponent,
        LiquiGroupMarginHistoryComponent
    ],
    providers   : [LiquiGroupMarginService]
})
export class LiquiGroupMarginModule {
}