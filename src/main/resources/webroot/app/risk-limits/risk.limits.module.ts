import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {CommonModule} from '../common/common.module';

import {RiskLimitsService} from './risk.limits.service';

import {RiskLimitLatestComponent} from './risk.limit.latest.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        RiskLimitLatestComponent
    ],
    exports: [
        RiskLimitLatestComponent
    ],
    providers: [RiskLimitsService]
})
export class RiskLimitsModule {
}