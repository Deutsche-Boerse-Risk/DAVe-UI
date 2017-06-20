import {ContentChildren} from '@angular/core';
import {Router} from '@angular/router';

import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {compileTestBed, RouterLinkStubDirective, RouterStub, stubRouter} from '@dbg-riskit/dave-ui-testing';

import {MenuPage} from '../../testing';

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

    compileTestBed(() => {
        // Use stub to override @ContentChildren in RouterLinkActiveDirective
        linksDecorator.selector = RouterLinkStubDirective;
        TestBed.configureTestingModule({
            imports: [MenuModule]
        });
        return stubRouter().compileComponents();
    });

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
        page.clickLink('Margin Requirement');
        page.clickLink('Position Reports');
        page.isActive('Position Reports', 'Margin Requirement');

        page.clickLink('Margin Requirement');
        page.clickLink('Liquidation Group Margin');
        page.isActive('Liquidation Group Margin', 'Margin Requirement');

        page.clickLink('Margin Requirement');
        page.clickLink('Variation / Premium Margin');
        page.isActive('Variation / Premium Margin', 'Margin Requirement');

        page.clickLink('Margin Requirement');
        page.clickLink('Initial Margin');
        page.isActive('Initial Margin', 'Margin Requirement');

        page.clickLink('Margin Requirement');
        page.clickLink('Account Margin');
        page.isActive('Account Margin', 'Margin Requirement');

        page.clickLink('Margin Requirement');
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
        page.clickLink('Margin Requirement');
        page.isActive('Position Reports', 'Margin Requirement');
        page.clickLink('Margin Requirement');

        router.navigateByUrl(ROUTES.LIQUI_GROUP_MARGIN_HISTORY);
        page.detectChanges();
        page.clickLink('Margin Requirement');
        page.isActive('Liquidation Group Margin', 'Margin Requirement');
        page.clickLink('Margin Requirement');

        router.navigateByUrl(ROUTES.INITIAL_MARGIN_HISTORY);
        page.detectChanges();
        page.clickLink('Margin Requirement');
        page.isActive('Initial Margin', 'Margin Requirement');
        page.clickLink('Margin Requirement');

        router.navigateByUrl(ROUTES.VARIATION_PREMIUM_MARGIN_HISTORY);
        page.detectChanges();
        page.clickLink('Margin Requirement');
        page.isActive('Variation / Premium Margin', 'Margin Requirement');
        page.clickLink('Margin Requirement');

        router.navigateByUrl(ROUTES.ACCOUNT_MARGIN_HISTORY);
        page.detectChanges();
        page.clickLink('Margin Requirement');
        page.isActive('Account Margin', 'Margin Requirement');
        page.clickLink('Margin Requirement');

        router.navigateByUrl(ROUTES.POOL_MARGIN_HISTORY);
        page.detectChanges();
        page.clickLink('Margin Requirement');
        page.isActive('Pool Margin', 'Margin Requirement');
        page.clickLink('Margin Requirement');

        page.clickLink('Risk Limit Utilization');
        page.isActive('Risk Limit Utilization');

        page.clickLink('Dashboard');
        page.isActive('Dashboard');
    })));
});