import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {CommonModule} from '../common/common.module';
import {MaterialModule} from '../material/material.module';
import {ChartsModule} from '../charts/charts.module';
import {DataTableModule} from '../datatable/data.table.module';
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
        CommonModule,
        DataTableModule,
        ListModule,
        MaterialModule
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