import {ContentChildren, NO_ERRORS_SCHEMA} from '@angular/core';
import {Router, RouterModule} from '@angular/router';

import {fakeAsync, TestBed} from '@angular/core/testing';

import {
    compileTestBed,
    NoopAnimationsCommonViewModule,
    RouterLinkStubDirective,
    stubRouter
} from '@dbg-riskit/dave-ui-testing';

import {DashboardPage, Tab} from '@dave/testing';

import {RouterLinkActiveDirective} from '../menu/router.link.active.directive';

import {DashboardComponent} from './dashboard.component';
import {ROUTES} from '../routes/routing.paths';

describe('DashboardComponent', () => {

    let page: DashboardPage;
    // Get @ContentChildren in RouterLinkActiveDirective
    let linksDecorator: ContentChildren = (Reflect as any).getMetadata('propMetadata',
        RouterLinkActiveDirective).links[0];
    let oldSelector = linksDecorator.selector;

    compileTestBed(() => {
        // Use stub to override @ContentChildren in RouterLinkActiveDirective
        linksDecorator.selector = RouterLinkStubDirective;
        TestBed.configureTestingModule({
            imports     : [
                RouterModule,
                NoopAnimationsCommonViewModule
            ],
            declarations: [
                DashboardComponent,
                RouterLinkActiveDirective
            ],
            schemas     : [NO_ERRORS_SCHEMA]
        });
        return stubRouter().compileComponents();
    }, () => {
        page.destroy();
        page = null;
    });

    beforeEach(fakeAsync(() => {
        page = new DashboardPage(TestBed.createComponent(DashboardComponent));
        page.detectChanges();

        let router = TestBed.get(Router);
        router.navigateByUrl(ROUTES.DASHBOARD_MARGIN_REQUIREMENT_OVERVIEW);
        page.detectChanges();
    }));

    afterEach(() => {
        // Restore component definition
        linksDecorator.selector = oldSelector;
    });

    it('has tabs with correct lables', fakeAsync(() => {
        expect(page.tabs.length).toBe(3, '3 tabs');
        expect(page.tabs.map((tab: Tab) => tab.label))
            .toEqual(['Margin Requirement Overview', 'Position Level Risk', 'Initial Margin']);
        expect(page.activeTab.label).toEqual('Margin Requirement Overview');
    }));

    xit('has correct content in tab panels', fakeAsync(() => {
        expect(page.contains('pool-margin-summary')).toBeTruthy('PoolMargin summary visible');
        expect(page.contains('liqui-group-margin-aggregation')).toBeTruthy('Margin components aggergetaion visible');
        expect(page.contains('liqui-group-margin-treemap')).toBeFalsy('Margin components treemap not visible');
        expect(page.contains('position-report-bubblechart')).toBeFalsy('Position report bubblechart not visible');

        page.tabs[1].click();

        expect(page.activeTab.label).toEqual('Position Level Risk');
        expect(page.contains('pool-margin-summary')).toBeFalsy('PoolMargin summary not visible');
        expect(page.contains('liqui-group-margin-aggregation')).toBeFalsy('Margin components aggergetaion not visible');
        expect(page.contains('liqui-group-margin-treemap')).toBeFalsy('Margin components treemap not visible');
        expect(page.contains('position-report-bubblechart')).toBeTruthy('Position report bubblechart visible');

        page.tabs[2].click();

        expect(page.activeTab.label).toEqual('Initial Margin');
        expect(page.contains('pool-margin-summary')).toBeFalsy('PoolMargin summary not visible');
        expect(page.contains('liqui-group-margin-aggregation')).toBeFalsy('Margin components aggergetaion not visible');
        expect(page.contains('liqui-group-margin-treemap')).toBeTruthy('Margin components treemap visible');
        expect(page.contains('position-report-bubblechart')).toBeFalsy('Position report bubblechart not visible');

        page.tabs[0].click();

        expect(page.activeTab.label).toEqual('Margin Requirement Overview');
        expect(page.contains('pool-margin-summary')).toBeTruthy('PoolMargin summary visible');
        expect(page.contains('liqui-group-margin-aggregation')).toBeTruthy('Margin components aggergetaion visible');
        expect(page.contains('liqui-group-margin-treemap')).toBeFalsy('Margin components treemap not visible');
        expect(page.contains('position-report-bubblechart')).toBeFalsy('Position report bubblechart not visible');

        page.tabs[2].click();

        expect(page.activeTab.label).toEqual('Initial Margin');
        expect(page.contains('pool-margin-summary')).toBeFalsy('PoolMargin summary not visible');
        expect(page.contains('liqui-group-margin-aggregation')).toBeFalsy('Margin components aggergetaion not visible');
        expect(page.contains('liqui-group-margin-treemap')).toBeTruthy('Margin components treemap visible');
        expect(page.contains('position-report-bubblechart')).toBeFalsy('Position report bubblechart not visible');

        page.tabs[1].click();

        expect(page.activeTab.label).toEqual('Position Level Risk');
        expect(page.contains('pool-margin-summary')).toBeFalsy('PoolMargin summary not visible');
        expect(page.contains('liqui-group-margin-aggregation')).toBeFalsy('Margin components aggergetaion not visible');
        expect(page.contains('liqui-group-margin-treemap')).toBeFalsy('Margin components treemap not visible');
        expect(page.contains('position-report-bubblechart')).toBeTruthy('Position report bubblechart visible');
    }));
});