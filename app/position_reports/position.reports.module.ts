import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {ChartsModule} from '@dbg-riskit/DAVe-UI-charts';
import {DataTableModule} from '@dbg-riskit/DAVe-UI-datatable';
import {CommonViewModule} from '@dbg-riskit/DAVe-UI-view';

import {ListModule} from '../list/list.module';

import {PositionReportsService} from './position.reports.service';

import {PositionReportBubbleChartComponent} from './position.report.bubblechart.component';
import {PositionReportLatestComponent} from './position.report.latest.component';
import {PositionReportHistoryComponent} from './position.report.history.component';

@NgModule({
    imports     : [
        BrowserModule,
        FormsModule,
        RouterModule,
        ChartsModule,
        DataTableModule,
        CommonViewModule,
        ListModule
    ],
    providers   : [PositionReportsService],
    declarations: [
        PositionReportBubbleChartComponent,
        PositionReportLatestComponent,
        PositionReportHistoryComponent
    ],
    exports     : [PositionReportBubbleChartComponent]
})
export class PositionReportsModule {
}