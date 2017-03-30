import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {CommonModule} from '../common/common.module';
import {DataTableModule} from '../datatable/data.table.module';
import {ListModule} from '../list/list.module';

import {PoolMarginService} from './pool.margin.service';

import {PoolMarginLatestSummaryComponent} from './pool.margin.latest.summary.component';
import {PoolMarginLatestComponent} from './pool.margin.latest.component';
import {PoolMarginHistoryComponent} from './pool.margin.history.component';

@NgModule({
    imports     : [
        BrowserModule,
        RouterModule,
        CommonModule,
        DataTableModule,
        ListModule
    ],
    declarations: [
        PoolMarginLatestSummaryComponent,
        PoolMarginLatestComponent,
        PoolMarginHistoryComponent
    ],
    exports     : [
        PoolMarginLatestSummaryComponent,
        PoolMarginLatestComponent,
        PoolMarginHistoryComponent
    ],
    providers   : [PoolMarginService]
})
export class PoolMarginModule {
}