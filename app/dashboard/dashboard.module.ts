import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '../material/material.module';

import {LiquiGroupMarginModule} from '../liqui_group_margin/liqui.group.margin.module';
import {PoolMarginModule} from '../pool_margin/pool.margin.module';

import {DashboardComponent} from './dashboard.component';
import {MarginRequirementOverviewComponent} from './margin.requirement.overview.component';

@NgModule({
    imports     : [
        BrowserModule,
        RouterModule,
        LiquiGroupMarginModule,
        PoolMarginModule,
        MaterialModule
    ],
    declarations: [
        DashboardComponent,
        MarginRequirementOverviewComponent
    ]
})
export class DashboardModule {
}