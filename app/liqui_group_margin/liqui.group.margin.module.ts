import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {ChartsModule} from '@dbg-riskit/DAVe-UI-charts';
import {DataTableModule} from '@dbg-riskit/DAVe-UI-datatable';
import {CommonViewModule} from '@dbg-riskit/DAVe-UI-view';

import {ListModule} from '../list/list.module';

import {LiquiGroupMarginService} from './liqui.group.margin.service';
import {LiquiGroupMarginLatestComponent} from './liqui.group.margin.latest.component';
import {LiquiGroupMarginHistoryComponent} from './liqui.group.margin.history.component';
import {LiquiGroupMarginAggregationComponent} from './liqui.group.margin.aggregation.component';
import {LiquiGroupMarginTreemapComponent} from './liqui.group.margin.treemap.component';

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
        LiquiGroupMarginLatestComponent,
        LiquiGroupMarginHistoryComponent,
        LiquiGroupMarginAggregationComponent,
        LiquiGroupMarginTreemapComponent
    ],
    exports     : [
        LiquiGroupMarginLatestComponent,
        LiquiGroupMarginHistoryComponent,
        LiquiGroupMarginAggregationComponent,
        LiquiGroupMarginTreemapComponent
    ],
    providers   : [LiquiGroupMarginService]
})
export class LiquiGroupMarginModule {
}