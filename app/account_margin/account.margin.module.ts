import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {ChartsModule} from '@dbg-riskit/DAVe-UI-charts';
import {DataTableModule} from '@dbg-riskit/DAVe-UI-datatable';
import {CommonViewModule} from '@dbg-riskit/DAVe-UI-view';

import {ListModule} from '../list/list.module';

import {AccountMarginService} from './account.margin.service';

import {AccountMarginLatestComponent} from './account.margin.latest.component';
import {AccountMarginHistoryComponent} from './account.margin.history.component';

@NgModule({
    imports     : [
        BrowserModule,
        RouterModule,
        ChartsModule,
        DataTableModule,
        CommonViewModule,
        ListModule
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
