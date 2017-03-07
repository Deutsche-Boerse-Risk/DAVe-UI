import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

import {ComponentFixture, TestBed, async, ComponentFixtureAutoDetect, fakeAsync} from "@angular/core/testing";

import {click, RouterLinkStubDirective} from "../../testing";

import {DrillDownRowButtonComponent} from "./drill.down.row.button.component";

describe('DrillDownRowButtonComponent', () => {

    let comp: DrillDownRowButtonComponent;
    let fixture: ComponentFixture<DrillDownRowButtonComponent>;
    let de: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrillDownRowButtonComponent, RouterLinkStubDirective],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrillDownRowButtonComponent);

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