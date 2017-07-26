import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AuthModule} from '@dbg-riskit/dave-ui-auth';
import {DATE_FORMAT} from '@dbg-riskit/dave-ui-common';
import {LayoutModule} from '@dbg-riskit/dave-ui-dummy-layout';
import {ErrorModule} from '@dbg-riskit/dave-ui-error';
import {LoginModule} from '@dbg-riskit/dave-ui-login';
import {CommonViewModule} from '@dbg-riskit/dave-ui-view';

import {AppComponent} from './app.component';

import {MenuModule} from './menu/menu.module';
import {RoutingModule} from './routes/routing.module';

import {PeriodicHttpService} from './periodic.http.service';

@NgModule({
    imports     : [
        AuthModule,
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
        PeriodicHttpService
    ]
})
export class AppModule {
}
