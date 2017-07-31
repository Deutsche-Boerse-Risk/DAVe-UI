import {NO_ERRORS_SCHEMA} from '@angular/core';
import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {AuthServiceStub, compileTestBed, RouterOutletStub, stubRouter} from '@dbg-riskit/dave-ui-testing';

import {AUTH_PROVIDER, LOGIN_ROUTE, MAIN_LOGO, MAIN_ROUTE} from '@dbg-riskit/dave-ui-common';
import {LoginMenuComponent} from '@dbg-riskit/dave-ui-login';
import {NoopAnimationsCommonViewModule} from '@dbg-riskit/dave-ui-view';

import {AppComponentPage} from '@dave/testing';

import {MenuComponent} from './menu/menu.component';
import {AppComponent} from './app.component';

describe('AppComponent', () => {

    let page: AppComponentPage;

    compileTestBed(() => {
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
                    provide    : AUTH_PROVIDER,
                    useExisting: AuthServiceStub
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
        page = null;
    });

    beforeEach(fakeAsync(() => {
        page = new AppComponentPage(TestBed.createComponent(AppComponent));
        page.detectChanges();
    }));

    it('does not have menu shown by default', fakeAsync(() => {
        expect(page.appMenu).toBeNull('Menu not shown');
        expect(page.loginMenu).toBeNull('Login menu not shown');
    }));

    it('does have menu shown once logged in', fakeAsync(inject([AUTH_PROVIDER],
        (auth: AuthServiceStub) => {
            auth.directLogin('user', 'pass');
            page.detectChanges();

            expect(page.appMenu).not.toBeNull('Menu shown');
            expect(page.loginMenu).not.toBeNull('Login menu shown');
        })));

    it('does have router outlet', fakeAsync(() => {
        expect(page.outlet).not.toBeNull('Router outlet shown');
    }));
});