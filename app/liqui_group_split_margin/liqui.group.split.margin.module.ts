import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {CommonModule} from '../common/common.module';
import {DataTableModule} from '../datatable/data.table.module';
import {ListModule} from '../list/list.module';

import {LiquiGroupSplitMarginService} from './liqui.group.split.margin.service';
import {LiquiGroupSplitMarginLatestComponent} from './liqui.group.split.margin.latest.component';
import {LiquiGroupSplitMarginHistoryComponent} from './liqui.group.split.margin.history.component';

@NgModule({
    imports     : [
        BrowserModule,
        RouterModule,
        CommonModule,
        DataTableModule,
        ListModule
    ],
    declarations: [
        LiquiGroupSplitMarginLatestComponent,
        LiquiGroupSplitMarginHistoryComponent
    ],
    exports     : [
        LiquiGroupSplitMarginLatestComponent,
        LiquiGroupSplitMarginHistoryComponent
    ],
    providers   : [LiquiGroupSplitMarginService]
})
export class LiquiGroupSplitMarginModule {
}