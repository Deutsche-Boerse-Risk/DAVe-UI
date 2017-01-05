import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {CommonModule} from '../common/common.module';

import {MarginService} from './margin.service';

import {MarginShortfallSurplusLatestSummaryComponent} from './margin.shortfall.surplus.latest.summary.component';
import {MarginAccountAggregationComponent} from './margin.account.aggregation.component';
import {MarginLatestComponent} from './margin.latest.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        MarginShortfallSurplusLatestSummaryComponent,
        MarginAccountAggregationComponent,
        MarginLatestComponent
    ],
    exports: [
        MarginShortfallSurplusLatestSummaryComponent,
        MarginAccountAggregationComponent,
        MarginLatestComponent
    ],
    providers: [MarginService]
})
export class MarginModule {
}