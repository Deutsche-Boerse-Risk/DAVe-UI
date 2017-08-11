import {NO_ERRORS_SCHEMA} from '@angular/core';
import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {
    AuthServiceStub,
    compileTestBed,
    LoginMenuComponentStub,
    RouterOutletStub,
    stubRouter
} from '@dbg-riskit/dave-ui-testing';

import {AUTH_PROVIDER, MAIN_LOGO, MAIN_ROUTE} from '@dbg-riskit/dave-ui-common';
import {NoopAnimationsCommonViewModule} from '@dbg-riskit/dave-ui-view';

import {AppComponentPage} from '@dave/testing';

import {MenuComponent} from './menu/menu.component';
import {AppComponent} from './app.component';
import {ɵResourceLoaderImpl} from '@angular/platform-browser-dynamic';

ɵResourceLoaderImpl.prototype.get;
describe('AppComponent', () => {

    let page: AppComponentPage;

    compileTestBed(() => {
        TestBed.configureTestingModule({
            imports     : [NoopAnimationsCommonViewModule],
            declarations: [
                AppComponent,
                MenuComponent,
                LoginMenuComponentStub,
                RouterOutletStub
            ],
            providers   : [
                {
                    provide : AUTH_PROVIDER,
                    useClass: AuthServiceStub
                },
                {
                    provide : MAIN_ROUTE,
                    useValue: '/some/route'
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
        page.destroy();
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