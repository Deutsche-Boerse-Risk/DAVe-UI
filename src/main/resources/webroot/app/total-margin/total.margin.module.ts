import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {CommonModule} from '../common/common.module';

import {TotalMarginService} from './total.margin.service';
import {TotalMarginRequirementLatestComponent} from './total.margin.requirement.latest.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        TotalMarginRequirementLatestComponent
    ],
    exports: [
        TotalMarginRequirementLatestComponent
    ],
    providers: [TotalMarginService]
})
export class TotalMarginModule {
}
