import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {CommonModule} from '../common/common.module';
import {DataTableModule} from '../datatable/data.table.module';
import {ListModule} from '../list/list.module';

import {AccountMarginService} from './account.margin.service';

import {AccountMarginLatestComponent} from './account.margin.latest.component';
import {AccountMarginHistoryComponent} from './account.margin.history.component';

@NgModule({
    imports     : [
        BrowserModule,
        RouterModule,
        DataTableModule,
        ListModule,
        CommonModule
    ],
    declarations: [
        AccountMarginLatestComponent,
        AccountMarginHistoryComponent
    ],
    exports     : [
        AccountMarginLatestComponent,
        AccountMarginHistoryComponent
    ],
    providers   : [AccountMarginService]
})
export class AccountMarginModule {
}
