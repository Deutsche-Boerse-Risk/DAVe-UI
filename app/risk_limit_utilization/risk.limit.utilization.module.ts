import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {ChartsModule, CommonViewModule, DataTableModule} from '@dbg-riskit/DAVe-common';

import {ListModule} from '../list/list.module';

import {RiskLimitUtilizationService} from './risk.limit.utilization.service';

import {RiskLimitUtilizationLatestComponent} from './risk.limit.utilization.latest.component';
import {RiskLimitUtilizationHistoryComponent} from './risk.limit.utilization.history.component';

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
        RiskLimitUtilizationLatestComponent,
        RiskLimitUtilizationHistoryComponent
    ],
    exports     : [
        RiskLimitUtilizationLatestComponent,
        RiskLimitUtilizationHistoryComponent
    ],
    providers   : [RiskLimitUtilizationService]
})
export class RiskLimitUtilizationModule {
}