import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {AUTH_PROVIDERS} from 'angular2-jwt';

import {AuthService} from './auth.service';
import {AuthGuard} from './auth.routing.guard';

import {LoginMenuComponent} from './login.menu.component';
import {LoginComponent} from './login.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule
    ],
    declarations: [LoginMenuComponent, LoginComponent],
    exports: [LoginMenuComponent],
    providers: AUTH_PROVIDERS.concat([AuthService, AuthGuard])
})
export class AuthModule {
}