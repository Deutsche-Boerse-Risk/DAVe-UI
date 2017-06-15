import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {ChartsModule} from '@dbg-riskit/dave-ui-charts';
import {DataTableModule} from '@dbg-riskit/dave-ui-datatable';
import {CommonViewModule} from '@dbg-riskit/dave-ui-view';

import {ListModule} from '../list/list.module';

import {PoolMarginService} from './pool.margin.service';

import {PoolMarginLatestSummaryComponent} from './pool.margin.latest.summary.component';
import {PoolMarginLatestComponent} from './pool.margin.latest.component';
import {PoolMarginHistoryComponent} from './pool.margin.history.component';

@NgModule({
    imports     : [
        BrowserModule,
        RouterModule,
        ChartsModule,
        DataTableModule,
        CommonViewModule,
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