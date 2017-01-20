import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {RequestOptions, Http} from '@angular/http';

import {AuthService} from './auth.service';
import {AuthGuard} from './auth.routing.guard';

import {LoginMenuComponent} from './login.menu.component';
import {LoginComponent} from './login.component';

export function AuthHttpFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({noJwtError: true}), http, options);
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule
    ],
    declarations: [LoginMenuComponent, LoginComponent],
    exports: [LoginMenuComponent],
    providers: [
        AuthService,
        AuthGuard,
        {
            provide: AuthHttp,
            deps: [Http, RequestOptions],
            useFactory: AuthHttpFactory
        }
    ]
})
export class AuthModule {
}