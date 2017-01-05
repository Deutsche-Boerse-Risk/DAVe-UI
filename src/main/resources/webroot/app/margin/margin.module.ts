import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {CommonModule} from '../common/common.module';

import {MarginAccountService} from './margin.account.service';

import {MarginAccountAggregationComponent} from './margin.account.aggregation.component';
import {MarginAccountLatestComponent} from './margin.account.latest.component';

import {MarginShortfallSurplusService} from './margin.shortfall.surplus.service';

import {MarginShortfallSurplusLatestSummaryComponent} from './margin.shortfall.surplus.latest.summary.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        MarginAccountAggregationComponent,
        MarginAccountLatestComponent,
        MarginShortfallSurplusLatestSummaryComponent
    ],
    exports: [
        MarginAccountAggregationComponent,
        MarginAccountLatestComponent,
        MarginShortfallSurplusLatestSummaryComponent
    ],
    providers: [MarginAccountService, MarginShortfallSurplusService]
})
export class MarginModule {
}