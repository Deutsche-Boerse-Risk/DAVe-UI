import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {TradingSessionStatusComponent} from "./trading.session.status.component";
import {TradingSessionService} from "./trading.session.service";

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [TradingSessionStatusComponent],
    exports: [TradingSessionStatusComponent],
    providers: [TradingSessionService]
})
export class TradingModule {
}