import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {DATE_FORMAT} from '@dbg-riskit/DAVe-UI-common';
import {AuthModule} from '@dbg-riskit/DAVe-UI-auth';
import {LoginModule} from '@dbg-riskit/DAVe-UI-login';
import {CommonViewModule} from '@dbg-riskit/DAVe-UI-view';

import {AppComponent} from './app.component';

import {MenuModule} from './menu/menu.module';
import {RoutingModule} from './routes/routing.module';

@NgModule({
    imports     : [
        AuthModule,
        BrowserModule,
        CommonViewModule,
        RoutingModule,
        MenuModule,
        LoginModule
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
        }
    ]
})
export class AppModule {
}
