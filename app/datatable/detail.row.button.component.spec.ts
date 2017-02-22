import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

import {ComponentFixture, TestBed, async, ComponentFixtureAutoDetect, fakeAsync} from "@angular/core/testing";

import {click} from "../../testing/index";
import {RouterLinkStubDirective} from "../../testing/router.link.stub";

import {DetailRowButtonComponent} from "./detail.row.button.component";

describe('DetailRowButtonComponent', () => {

    let comp: DetailRowButtonComponent;
    let fixture: ComponentFixture<DetailRowButtonComponent>;
    let de: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DetailRowButtonComponent, RouterLinkStubDirective],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DetailRowButtonComponent);

        comp = fixture.componentInstance;
        de = fixture.debugElement.query(By.directive(RouterLinkStubDirective));
    });

    it('navigates correctly', fakeAsync(() => {
        comp.routerLink = ['/test', 'url'];
        fixture.detectChanges();

        let routerLink: RouterLinkStubDirective = de.injector.get(RouterLinkStubDirective);
        let navigateSpy = spyOn(routerLink, 'onClick').and.callThrough();

        click(de);

        expect(navigateSpy).toHaveBeenCalled();
        expect(routerLink.navigatedTo).toEqual(['/test', 'url']);
    }));
});