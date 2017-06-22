import {NO_ERRORS_SCHEMA} from '@angular/core';
import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {
    AuthServiceStub,
    compileTestBed,
    fakeMatchMedia,
    RouterOutletStub,
    stubRouter
} from '@dbg-riskit/dave-ui-testing';

import {AUTH_PROVIDER, LOGIN_ROUTE, MAIN_LOGO, MAIN_ROUTE} from '@dbg-riskit/dave-ui-common';
import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {LoginMenuComponent} from '@dbg-riskit/dave-ui-login';
import {NoopAnimationsCommonViewModule} from '@dbg-riskit/dave-ui-view';

import {AppComponentPage} from '@dave/testing';

import {MenuComponent} from './menu/menu.component';
import {AppComponent} from './app.component';

describe('AppComponent', () => {

    let page: AppComponentPage;
    let matchMedia: any;

    compileTestBed(() => {
        matchMedia = window.matchMedia;
        window.matchMedia = fakeMatchMedia();

        TestBed.configureTestingModule({
            imports     : [NoopAnimationsCommonViewModule],
            declarations: [
                AppComponent,
                MenuComponent,
                LoginMenuComponent,
                RouterOutletStub
            ],
            providers   : [
                {
                    provide : AuthService,
                    useClass: AuthServiceStub
                },
                {
                    provide    : AUTH_PROVIDER,
                    useExisting: AuthService
                },
                {
                    provide : MAIN_ROUTE,
                    useValue: '/some/route'
                },
                {
                    provide : LOGIN_ROUTE,
                    useValue: '/login'
                },
                {
                    provide : MAIN_LOGO,
                    useValue: '/someLogo.svg'
                }
            ],
            schemas     : [NO_ERRORS_SCHEMA]
        });
        return stubRouter().compileComponents();
    }, () => {
        window.matchMedia = matchMedia;
    });

    beforeEach(fakeAsync(() => {
        page = new AppComponentPage(TestBed.createComponent(AppComponent));
        page.detectChanges();
    }));

    it('does not have menu shown by default', fakeAsync(() => {
        expect(page.appMenu).toBeNull('Menu not shown');
        expect(page.loginMenu).toBeNull('Login menu not shown');
    }));

    it('does have menu shown once logged in', fakeAsync(inject([AuthService], (auth: AuthServiceStub) => {
        auth.login('user', 'pass');
        page.detectChanges();

        expect(page.appMenu).not.toBeNull('Menu shown');
        expect(page.loginMenu).not.toBeNull('Login menu shown');
    })));

    it('does have router outlet', fakeAsync(() => {
        expect(page.outlet).not.toBeNull('Router outlet shown');
    }));
});