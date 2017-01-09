import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {CommonModule} from '../common/common.module';
import {DataTableModule} from '../datatable/data.table.module';
import {ListModule} from '../list/list.module';

import {TotalMarginService} from './total.margin.service';

import {TotalMarginRequirementLatestComponent} from './total.margin.requirement.latest.component';
import {TotalMarginRequirementHistoryComponent} from './total.margin.requirement.history.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        DataTableModule,
        ListModule,
        CommonModule
    ],
    declarations: [
        TotalMarginRequirementLatestComponent,
        TotalMarginRequirementHistoryComponent
    ],
    exports: [
        TotalMarginRequirementLatestComponent,
        TotalMarginRequirementHistoryComponent
    ],
    providers: [TotalMarginService]
})
export class TotalMarginModule {
}
