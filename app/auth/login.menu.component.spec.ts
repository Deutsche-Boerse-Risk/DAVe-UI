import {TestBed, async, inject, fakeAsync} from '@angular/core/testing';

import {AuthServiceStub, RouterLinkStubDirective, LoginMenuPage} from '../../testing';

import {AuthService} from './auth.service';
import {LoginMenuComponent} from './login.menu.component';
import {ROUTES} from '../routes/routing.paths';

describe('Login menu', () => {
    let page: LoginMenuPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoginMenuComponent,
                RouterLinkStubDirective
            ],
            providers   : [
                {
                    provide : AuthService,
                    useClass: AuthServiceStub
                }
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new LoginMenuPage(TestBed.createComponent(LoginMenuComponent));
        page.detectChanges();
    }));

    it('works as expected', fakeAsync(inject([AuthService], (auth: AuthServiceStub) => {
        let clickSpy = spyOn(page.component, 'logout').and.callThrough();

        expect(page.loginLink.text).toContain('Login');

        page.loginLink.click();

        expect(clickSpy).not.toHaveBeenCalled();
        expect(page.loginLink.stub.navigatedTo).toContain(ROUTES.LOGIN);

        auth.login('testUser', 'somePassword');
        page.detectChanges();

        expect(page.logoutLink.text).toContain('Logout');

        page.logoutLink.click();

        expect(clickSpy).toHaveBeenCalled();
    })));
});