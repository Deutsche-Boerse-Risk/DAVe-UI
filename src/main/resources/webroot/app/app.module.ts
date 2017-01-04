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
