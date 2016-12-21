import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {DashboardComponent} from "./dashboard.component";
import {PositionReportsModule} from "../position-reports/position.reports.module";
import {MarginModule} from "../margin/margin.module";

@NgModule({
    imports: [
        BrowserModule,
        PositionReportsModule,
        MarginModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule {
}