import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {ComponentFixture, TestBed, async, ComponentFixtureAutoDetect, inject} from "@angular/core/testing";

import {AuthServiceStub} from "../../testing/auth.service.stub";
import {RouterLinkStubDirective} from "../../testing/router.link.stub";
import {click} from "../../testing/index";

import {AuthService} from "./auth.service";
import {LoginMenuComponent} from "./login.menu.component";

describe('Login menu', () => {

    let comp: LoginMenuComponent;
    let fixture: ComponentFixture<LoginMenuComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let linkStub: RouterLinkStubDirective;

    function searchForLink() {
        // query for the title by CSS element selector
        de = fixture.debugElement.query(By.directive(RouterLinkStubDirective));
        el = de.nativeElement;

        linkStub = de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective;
    }

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

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginMenuComponent);

        comp = fixture.componentInstance;
    });

    it('works as expected', inject([AuthService], (auth: AuthServiceStub) => {

        searchForLink();

        let clickSpy = spyOn(comp, 'logout').and.callThrough();

        expect(el.textContent).toContain('Login');

        click(de);

        expect(clickSpy).not.toHaveBeenCalled();
        expect(linkStub.navigatedTo).toContain('/login');

        linkStub.navigatedTo = null;

        auth.login('testUser', 'somePassword');
        fixture.detectChanges();

        searchForLink();

        expect(el.textContent).toContain('Logout');

        click(el);

        expect(clickSpy).toHaveBeenCalled();
        expect(linkStub.navigatedTo).toContain('/login');
    }));
});