import {DebugElement} from "@angular/core";
import {LocationStrategy} from "@angular/common";
import {By} from "@angular/platform-browser";
import {Router, ActivatedRoute} from "@angular/router";

import {TestBed, ComponentFixtureAutoDetect, async, ComponentFixture, inject} from "@angular/core/testing";

import {RouterStub, LocationStrategyStub} from "../../testing/router.stub";
import {ActivatedRouteStub} from "../../testing/activated.route.stub";
import {click} from "../../testing/index";

import {MenuModule} from "./menu.module";
import {MenuComponent} from "./menu.component";
import {RouterLinkActiveDirective} from "./router.link.active.directive";

describe('Menu component', () => {

    let comp: MenuComponent;
    let fixture: ComponentFixture<MenuComponent>;
    let links: DebugElement[];

    function isActive(...args: string[]) {
        let activeLinkLabels: string[] = links.filter((link: DebugElement) => {
            return link.nativeElement.classList.contains('active');
        }).map((link: DebugElement) => {
            return link.query(By.css('a')).nativeElement.textContent.trim();
        });

        expect(activeLinkLabels.length).toBe(args.length);

        args.forEach((linkLabel: string) => {
            expect(activeLinkLabels).toContain(linkLabel);
        });
    }

    function clickLink(linkLabel: string) {
        let link: DebugElement = links.find((link: DebugElement) => {
            return link.query(By.css('a')).nativeElement.textContent.trim() === linkLabel;
        });

        click(link.query(By.css('a')));
        fixture.detectChanges();
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MenuModule],
            providers: [
                {provide: Router, useClass: RouterStub},
                {provide: ActivatedRoute, useClass: ActivatedRouteStub},
                {provide: LocationStrategy, useClass: LocationStrategyStub},
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuComponent);

        comp = fixture.componentInstance;
        links = fixture.debugElement.queryAll(By.directive(RouterLinkActiveDirective));
    });

    it('has "Dashboard" active', () => {
        isActive('Dashboard');
    });

    it('click on links works', () => {
        clickLink('Position Reports');
        isActive('Position Reports', 'Margin Requirement');

        clickLink('Margin Components');
        isActive('Margin Components', 'Margin Requirement');

        clickLink('Total Margin Requirements');
        isActive('Total Margin Requirements', 'Margin Requirement');

        clickLink('Margin Shortfall Surplus');
        isActive('Margin Shortfall Surplus', 'Margin Requirement');

        clickLink('Risk Limits');
        isActive('Risk Limits');

        clickLink('Dashboard');
        isActive('Dashboard');
    });

    it('navigation to sub-links works', inject([Router], (router: RouterStub) => {
        router.navigateByUrl('/positionReportHistory');
        fixture.detectChanges();
        isActive('Position Reports', 'Margin Requirement');

        router.navigateByUrl('/marginComponentHistory');
        fixture.detectChanges();
        isActive('Margin Components', 'Margin Requirement');

        router.navigateByUrl('/totalMarginRequirementHistory');
        fixture.detectChanges();
        isActive('Total Margin Requirements', 'Margin Requirement');

        router.navigateByUrl('/marginShortfallSurplusHistory');
        fixture.detectChanges();
        isActive('Margin Shortfall Surplus', 'Margin Requirement');

        clickLink('Risk Limits');
        isActive('Risk Limits');

        clickLink('Dashboard');
        isActive('Dashboard');
    }));
});