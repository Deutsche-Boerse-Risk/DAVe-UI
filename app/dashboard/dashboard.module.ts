import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {CommonViewModule} from '@dbg-riskit/DAVe-UI-view';

import {LiquiGroupMarginModule} from '../liqui_group_margin/liqui.group.margin.module';
import {PoolMarginModule} from '../pool_margin/pool.margin.module';

import {DashboardComponent} from './dashboard.component';
import {MarginRequirementOverviewComponent} from './margin.requirement.overview.component';

@NgModule({
    imports     : [
        BrowserModule,
        RouterModule,
        CommonViewModule,
        LiquiGroupMarginModule,
        PoolMarginModule
    ],
    declarations: [
        DashboardComponent,
        MarginRequirementOverviewComponent
    ]
})
export class DashboardModule {
}