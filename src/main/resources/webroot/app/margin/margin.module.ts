import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {CommonModule} from '../common/common.module';
import {DataTableModule} from '../datatable/data.table.module';
import {ListModule} from '../list/list.module';

import {MarginComponentsService} from './margin.components.service';

import {MarginComponentsAggregationComponent} from './margin.components.aggregation.component';
import {MarginComponentsLatestComponent} from './margin.components.latest.component';

import {MarginShortfallSurplusService} from './margin.shortfall.surplus.service';

import {MarginShortfallSurplusLatestSummaryComponent} from './margin.shortfall.surplus.latest.summary.component';
import {MarginShortfallSurplusLatestComponent} from './margin.shortfall.surplus.latest.component';
import {MarginComponentsHistoryComponent} from './margin.components.history.component';
import {MarginShortfallSurplusHistoryComponent} from './margin.shortfall.surplus.history.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        CommonModule,
        DataTableModule,
        ListModule,
    ],
    declarations: [
        MarginComponentsAggregationComponent,
        MarginComponentsLatestComponent,
        MarginComponentsHistoryComponent,
        MarginShortfallSurplusLatestSummaryComponent,
        MarginShortfallSurplusLatestComponent,
        MarginShortfallSurplusHistoryComponent
    ],
    exports: [
        MarginComponentsAggregationComponent,
        MarginComponentsLatestComponent,
        MarginComponentsHistoryComponent,
        MarginShortfallSurplusLatestSummaryComponent,
        MarginShortfallSurplusLatestComponent,
        MarginShortfallSurplusHistoryComponent
    ],
    providers: [MarginComponentsService, MarginShortfallSurplusService]
})
export class MarginModule {
}