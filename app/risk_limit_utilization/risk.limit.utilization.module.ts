import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {ChartsModule} from '@dbg-riskit/DAVe-UI-charts';
import {DataTableModule} from '@dbg-riskit/DAVe-UI-datatable';
import {CommonViewModule} from '@dbg-riskit/DAVe-UI-view';

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