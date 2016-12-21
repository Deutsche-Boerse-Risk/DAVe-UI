import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

import {CommonModule} from "../common/common.module";

import {PositionReportsService} from "./position.reports.service";

import {PositionReportBubbleChartComponent} from "./position.report.bubblechart.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        CommonModule
    ],
    providers: [PositionReportsService],
    declarations: [PositionReportBubbleChartComponent],
    exports: [PositionReportBubbleChartComponent]
})
export class PositionReportsModule {
}