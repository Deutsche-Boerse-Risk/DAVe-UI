import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

import {ComponentFixture, TestBed, async, ComponentFixtureAutoDetect, fakeAsync} from "@angular/core/testing";

import {click, RouterLinkStubDirective} from "../../testing";

import {DrilldownButtonComponent} from "./drilldown.button.component";

describe('DrilldownButtonComponent', () => {

    let comp: DrilldownButtonComponent;
    let fixture: ComponentFixture<DrilldownButtonComponent>;
    let de: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrilldownButtonComponent, RouterLinkStubDirective],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrilldownButtonComponent);

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