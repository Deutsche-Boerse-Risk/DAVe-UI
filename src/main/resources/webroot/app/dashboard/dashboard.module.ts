import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {DashboardComponent} from "./dashboard.component";
import {PositionReportsModule} from "../position-reports/position.reports.module";

@NgModule({
    imports: [
        BrowserModule,
        PositionReportsModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule {
}