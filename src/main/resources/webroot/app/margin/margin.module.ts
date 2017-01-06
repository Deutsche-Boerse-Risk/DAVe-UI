import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {CommonModule} from '../common/common.module';

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
        FormsModule,
        CommonModule
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