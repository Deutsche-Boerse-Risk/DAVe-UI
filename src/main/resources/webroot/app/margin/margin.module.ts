import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {CommonModule} from '../common/common.module';

import {MarginService} from './margin.service';

import {MarginShortfallSurplusLatestSummaryComponent} from './margin.shortfall.surplus.latest.summary.component';
import {MarginAccountAggregationComponent} from './margin.account.aggregation.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        CommonModule
    ],
    declarations: [
        MarginShortfallSurplusLatestSummaryComponent,
        MarginAccountAggregationComponent
    ],
    exports: [
        MarginShortfallSurplusLatestSummaryComponent,
        MarginAccountAggregationComponent
    ],
    providers: [MarginService]
})
export class MarginModule {
}