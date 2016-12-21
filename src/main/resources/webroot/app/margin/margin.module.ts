import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {MarginService} from "./margin.service";

import {MarginShortfallSurplusLatestSummaryComponent} from "./margin.shortfall.surplus.latest.summary.component";

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        MarginShortfallSurplusLatestSummaryComponent
    ],
    exports: [
        MarginShortfallSurplusLatestSummaryComponent
    ],
    providers: [MarginService]
})
export class MarginModule {
}