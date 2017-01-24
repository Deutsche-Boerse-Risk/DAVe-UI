import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, JsonpModule, Http} from '@angular/http';

import {HttpService} from './http.service';

import {AppComponent} from './app.component';

import {AuthModule} from './auth/auth.module';
import {AuthHttp} from "angular2-jwt";

import {MenuModule} from './menu/menu.module';
import {RoutingModule} from './routes/routing.module';

import {TradingModule} from './trading/trading.module';

export function HttpServiceFactory(http: Http, authHttp: AuthHttp): HttpService<any> {
    return new HttpService(http, authHttp);
}

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
    providers: [
        {
            provide: HttpService,
            deps: [Http, AuthHttp],
            useFactory: HttpServiceFactory
        }

    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
