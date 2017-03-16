import {ContentChildren} from '@angular/core';
import {Router} from '@angular/router';

import {TestBed, async, inject, fakeAsync} from '@angular/core/testing';

import {MenuPage, RouterStub, RouterLinkStubDirective, stubRouter} from '../../testing';

import {MenuModule} from './menu.module';
import {MenuComponent} from './menu.component';
import {RouterLinkActiveDirective} from './router.link.active.directive';

describe('Menu component', () => {

    let page: MenuPage;
    // Get @ContentChildren in RouterLinkActiveDirective
    let linksDecorator: ContentChildren = (Reflect as any).getMetadata('propMetadata', RouterLinkActiveDirective).links[0];
    let oldSelector = linksDecorator.selector;

    beforeEach(async(() => {
        // Use stub to override @ContentChildren in RouterLinkActiveDirective
        linksDecorator.selector = RouterLinkStubDirective;
        TestBed.configureTestingModule({
            imports: [MenuModule]
        });
        stubRouter().compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new MenuPage(TestBed.createComponent(MenuComponent));
        page.detectChanges();
    }));

    afterEach(() => {
        // Restore component definition
        linksDecorator.selector = oldSelector;
    });

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