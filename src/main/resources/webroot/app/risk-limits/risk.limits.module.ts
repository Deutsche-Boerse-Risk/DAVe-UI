import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {CommonModule} from '../common/common.module';

import {RiskLimitsService} from './risk.limits.service';

import {RiskLimitLatestComponent} from './risk.limit.latest.component';
import {RiskLimitHistoryComponent} from './risk.limit.history.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        RiskLimitLatestComponent,
        RiskLimitHistoryComponent
    ],
    exports: [
        RiskLimitLatestComponent,
        RiskLimitHistoryComponent
    ],
    providers: [RiskLimitsService]
})
export class RiskLimitsModule {
}