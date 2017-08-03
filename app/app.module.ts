import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AuthFlow, AuthModule} from '@dbg-riskit/dave-ui-auth';
import {DATE_FORMAT} from '@dbg-riskit/dave-ui-common';
import {LayoutModule} from '@dbg-riskit/dave-ui-dummy-layout';
import {ErrorModule} from '@dbg-riskit/dave-ui-error';
import {HTTP_ENDPOINT} from '@dbg-riskit/dave-ui-http';
import {LoginModule} from '@dbg-riskit/dave-ui-login';
import {CommonViewModule} from '@dbg-riskit/dave-ui-view';

import {AppComponent} from './app.component';

import {MenuModule} from './menu/menu.module';
import {RoutingModule} from './routes/routing.module';

import {PeriodicHttpService} from './periodic.http.service';

// Global configuration properties
declare namespace window {
    let baseRestURL: string;

    let authWellKnownEndpoint: string;
    let authClientID: string;
    let authScopes: ('profile' | 'group' | 'email' | 'address' | 'phone')[];
    let authFlow: 'openid-connect/authorization-code' |
        'openid-connect/implicit' |
        'openid-connect/hybrid' |
        'openid-connect/direct';
}

@NgModule({
    imports     : [
        AuthModule.forAuthConfig({
            wellKnown: window.authWellKnownEndpoint,
            clientID : window.authClientID,
            flow     : AuthFlow.byType(window.authFlow),
            scope    : window.authScopes
        }),
        BrowserModule,
        CommonViewModule,
        RoutingModule,
        MenuModule,
        LoginModule,
        LayoutModule,
        ErrorModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap   : [
        AppComponent
    ],
    providers   : [
        {
            provide : DATE_FORMAT,
            useValue: 'dd. MM. yyyy HH:mm:ss'
        },
        {
            provide : HTTP_ENDPOINT,
            useValue: window.baseRestURL
        },
        PeriodicHttpService
    ]
})
export class AppModule {
}
