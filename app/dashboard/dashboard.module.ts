import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {DashboardComponent} from './dashboard.component';
import {PositionReportsModule} from '../position_reports/position.reports.module';
import {MarginModule} from '../margin/margin.module';
import {PoolMarginModule} from '../pool_margin/pool.margin.module';

@NgModule({
    imports     : [
        BrowserModule,
        PositionReportsModule,
        MarginModule,
        PoolMarginModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule {
}