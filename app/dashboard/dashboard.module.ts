import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {CommonViewModule} from '@dbg-riskit/dave-ui-view';

import {DashboardComponent} from './dashboard.component';

@NgModule({
    imports     : [
        RouterModule,
        CommonViewModule
    ],
    declarations: [
        DashboardComponent
    ]
})
export class DashboardModule {
}