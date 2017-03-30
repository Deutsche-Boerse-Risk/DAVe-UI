import {TestBed, async, inject, fakeAsync} from '@angular/core/testing';

import {AuthServiceStub, RouterLinkStubDirective, LinkOnlyPage} from '../../testing';

import {AuthService} from './auth.service';
import {LoginMenuComponent} from './login.menu.component';

describe('Login menu', () => {
    let page: LinkOnlyPage<LoginMenuComponent>;

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
        page = new LinkOnlyPage<LoginMenuComponent>(TestBed.createComponent(LoginMenuComponent));
        page.detectChanges();
    }));

    it('works as expected', fakeAsync(inject([AuthService], (auth: AuthServiceStub) => {
        let clickSpy = spyOn(page.component, 'logout').and.callThrough();

        expect(page.link.text).toContain('Login');

        page.link.click();

        expect(clickSpy).not.toHaveBeenCalled();
        expect(page.link.stub.navigatedTo).toContain('/login');

        page.link.stub.navigatedTo = null;

        auth.login('testUser', 'somePassword');
        page.detectChanges();

        expect(page.link.text).toContain('Logout');

        let stub = page.link.stub;
        page.link.click();

        expect(clickSpy).toHaveBeenCalled();
        expect(stub.navigatedTo).toContain('/login');
    })));
});