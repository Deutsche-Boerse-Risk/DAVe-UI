import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {CommonModule} from '../common/common.module';
import {DataTableModule} from '../datatable/data.table.module';
import {ListModule} from '../list/list.module';

import {MarginService} from './margin.service';
import {MarginComponentsAggregationComponent} from './margin.components.aggregation.component';
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
        MarginComponentsAggregationComponent,
        MarginComponentsTreemapComponent
    ],
    exports     : [
        MarginComponentsAggregationComponent,
        MarginComponentsTreemapComponent
    ],
    providers   : [MarginService]
})
export class MarginModule {
}