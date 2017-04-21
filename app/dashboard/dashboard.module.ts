import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MaterialModule} from '../material/material.module';

import {DashboardComponent} from './dashboard.component';
import {PositionReportsModule} from '../position_reports/position.reports.module';
import {LiquiGroupMarginModule} from '../liqui_group_margin/liqui.group.margin.module';
import {PoolMarginModule} from '../pool_margin/pool.margin.module';

@NgModule({
    imports     : [
        BrowserModule,
        PositionReportsModule,
        LiquiGroupMarginModule,
        PoolMarginModule,
        MaterialModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule {
}