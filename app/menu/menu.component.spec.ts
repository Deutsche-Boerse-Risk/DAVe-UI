import {LocationStrategy} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';

import {TestBed, ComponentFixtureAutoDetect, async, inject, fakeAsync} from '@angular/core/testing';

import {MenuPage, RouterStub, ActivatedRouteStub, LocationStrategyStub} from '../../testing';

import {MenuModule} from './menu.module';
import {MenuComponent} from './menu.component';

describe('Menu component', () => {

    let page: MenuPage;

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

    beforeEach(fakeAsync(() => {
        page = new MenuPage(TestBed.createComponent(MenuComponent));
    }));

    it('has "Dashboard" active', fakeAsync(() => {
        page.isActive('Dashboard');
    }));

    it('click on links works', fakeAsync(() => {
        page.clickLink('Position Reports');
        page.isActive('Position Reports', 'Margin Requirement');

        page.clickLink('Margin Components');
        page.isActive('Margin Components', 'Margin Requirement');

        page.clickLink('Total Margin Requirements');
        page.isActive('Total Margin Requirements', 'Margin Requirement');

        page.clickLink('Margin Shortfall Surplus');
        page.isActive('Margin Shortfall Surplus', 'Margin Requirement');

        page.clickLink('Risk Limits');
        page.isActive('Risk Limits');

        page.clickLink('Dashboard');
        page.isActive('Dashboard');
    }));

    it('navigation to sub-links works', fakeAsync(inject([Router], (router: RouterStub) => {
        router.navigateByUrl('/positionReportHistory');
        page.detectChanges();
        page.isActive('Position Reports', 'Margin Requirement');

        router.navigateByUrl('/marginComponentHistory');
        page.detectChanges();
        page.isActive('Margin Components', 'Margin Requirement');

        router.navigateByUrl('/totalMarginRequirementHistory');
        page.detectChanges();
        page.isActive('Total Margin Requirements', 'Margin Requirement');

        router.navigateByUrl('/marginShortfallSurplusHistory');
        page.detectChanges();
        page.isActive('Margin Shortfall Surplus', 'Margin Requirement');

        page.clickLink('Risk Limits');
        page.isActive('Risk Limits');

        page.clickLink('Dashboard');
        page.isActive('Dashboard');
    })));
});