import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, JsonpModule} from '@angular/http';

import {AppComponent} from './app.component';

import {AuthModule} from './auth/auth.module';

import {MenuModule} from './menu/menu.module';
import {RoutingModule} from './routes/routing.module';

import {TradingModule} from './trading/trading.module';

@NgModule({
    imports: [
        BrowserModule,
        RoutingModule,
        HttpModule,
        JsonpModule,
        MenuModule,
        AuthModule,
        TradingModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

/**
 * TODO:
 * 1) sorting
 * 2) colspan in position reports history (detail row)
 * 3) -0.00 in Margin Shortfall Surplus
 * 4) Tree map
 * 5) highlighting
 * 6) replacing rows closes the opened rows
 * 7) Find out how to remove decorators in generated AoT JS bundle
 * 8) Memory leak? App crash in few hours?
 */