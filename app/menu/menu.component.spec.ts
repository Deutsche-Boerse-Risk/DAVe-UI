import {ContentChildren} from '@angular/core';
import {Router} from '@angular/router';

import {TestBed, async, inject, fakeAsync} from '@angular/core/testing';

import {MenuPage, RouterStub, RouterLinkStubDirective, stubRouter} from '../../testing';

import {MenuModule} from './menu.module';
import {MenuComponent} from './menu.component';
import {RouterLinkActiveDirective} from './router.link.active.directive';
import {ROUTES} from '../routes/routing.paths';

describe('Menu component', () => {

    let page: MenuPage;
    // Get @ContentChildren in RouterLinkActiveDirective
    let linksDecorator: ContentChildren = (Reflect as any).getMetadata('propMetadata',
        RouterLinkActiveDirective).links[0];
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

        page.clickLink('Liquidation Group Margin');
        page.isActive('Liquidation Group Margin', 'Margin Requirement');

        page.clickLink('Variation / Premium Margin');
        page.isActive('Variation / Premium Margin', 'Margin Requirement');

        page.clickLink('Initial Margin');
        page.isActive('Initial Margin', 'Margin Requirement');

        page.clickLink('Account Margin');
        page.isActive('Account Margin', 'Margin Requirement');

        page.clickLink('Pool Margin');
        page.isActive('Pool Margin', 'Margin Requirement');

        page.clickLink('Risk Limit Utilization');
        page.isActive('Risk Limit Utilization');

        page.clickLink('Dashboard');
        page.isActive('Dashboard');
    }));

    it('navigation to sub-links works', fakeAsync(inject([Router], (router: RouterStub) => {
        router.navigateByUrl(ROUTES.POSITION_REPORTS_HISTORY);
        page.detectChanges();
        page.isActive('Position Reports', 'Margin Requirement');

        router.navigateByUrl(ROUTES.LIQUI_GROUP_MARGIN_HISTORY);
        page.detectChanges();
        page.isActive('Liquidation Group Margin', 'Margin Requirement');

        router.navigateByUrl(ROUTES.INITIAL_MARGIN_HISTORY);
        page.detectChanges();
        page.isActive('Initial Margin', 'Margin Requirement');

        router.navigateByUrl(ROUTES.VARIATION_PREMIUM_MARGIN_HISTORY);
        page.detectChanges();
        page.isActive('Variation / Premium Margin', 'Margin Requirement');

        router.navigateByUrl(ROUTES.ACCOUNT_MARGIN_HISTORY);
        page.detectChanges();
        page.isActive('Account Margin', 'Margin Requirement');

        router.navigateByUrl(ROUTES.POOL_MARGIN_HISTORY);
        page.detectChanges();
        page.isActive('Pool Margin', 'Margin Requirement');

        page.clickLink('Risk Limit Utilization');
        page.isActive('Risk Limit Utilization');

        page.clickLink('Dashboard');
        page.isActive('Dashboard');
    })));
});