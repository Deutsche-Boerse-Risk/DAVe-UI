import {TestBed, async, ComponentFixtureAutoDetect, inject, fakeAsync} from "@angular/core/testing";

import {AuthServiceStub, RouterLinkStubDirective, LoginMenuPage} from "../../testing";

import {AuthService} from "./auth.service";
import {LoginMenuComponent} from "./login.menu.component";

describe('Login menu', () => {
    let page: LoginMenuPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoginMenuComponent,
                RouterLinkStubDirective
            ],
            providers: [
                {
                    provide: AuthService, useClass: AuthServiceStub
                },
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new LoginMenuPage(TestBed.createComponent(LoginMenuComponent));
        page.detectChanges();
    }));

    it('works as expected', fakeAsync(inject([AuthService], (auth: AuthServiceStub) => {
        let clickSpy = spyOn(page.component, 'logout').and.callThrough();

        expect(page.linkText).toContain('Login');

        page.clickLink();

        expect(clickSpy).not.toHaveBeenCalled();
        expect(page.linkStub.navigatedTo).toContain('/login');

        page.linkStub.navigatedTo = null;

        auth.login('testUser', 'somePassword');
        page.detectChanges();

        expect(page.linkText).toContain('Logout');

        let stub = page.linkStub;
        page.clickLink();

        expect(clickSpy).toHaveBeenCalled();
        expect(stub.navigatedTo).toContain('/login');
    })));
});