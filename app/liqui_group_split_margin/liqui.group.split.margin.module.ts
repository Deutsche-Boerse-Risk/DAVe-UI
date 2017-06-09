import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {ChartsModule, CommonViewModule, DataTableModule} from '@dbg-riskit/DAVe-common';

import {ListModule} from '../list/list.module';

import {LiquiGroupSplitMarginService} from './liqui.group.split.margin.service';

import {InitialMarginLatestComponent} from './initial_margin/initial.margin.latest.component';
import {InitialMarginHistoryComponent} from './initial_margin/initial.margin.history.component';
import {VariationPremiumMarginLatestComponent} from './variation_premium_margin/variation.premium.margin.latest.component';
import {VariationPremiumMarginHistoryComponent} from './variation_premium_margin/variation.premium.margin.history.component';

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
        InitialMarginLatestComponent,
        InitialMarginHistoryComponent,
        VariationPremiumMarginLatestComponent,
        VariationPremiumMarginHistoryComponent
    ],
    exports     : [
        InitialMarginLatestComponent,
        InitialMarginHistoryComponent,
        VariationPremiumMarginLatestComponent,
        VariationPremiumMarginHistoryComponent
    ],
    providers   : [LiquiGroupSplitMarginService]
})
export class LiquiGroupSplitMarginModule {
}