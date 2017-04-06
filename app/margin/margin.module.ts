import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {CommonModule} from '../common/common.module';
import {DataTableModule} from '../datatable/data.table.module';
import {ListModule} from '../list/list.module';

import {MarginService} from './margin.service';
import {MarginComponentsTreemapComponent} from './margin.components.treemap.component';

@NgModule({
    imports     : [
        BrowserModule,
        RouterModule,
        CommonModule,
        DataTableModule,
        ListModule
    ],
    declarations: [
        MarginComponentsTreemapComponent
    ],
    exports     : [
        MarginComponentsTreemapComponent
    ],
    providers   : [MarginService]
})
export class MarginModule {
}