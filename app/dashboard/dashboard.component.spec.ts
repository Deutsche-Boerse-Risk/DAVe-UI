import {NO_ERRORS_SCHEMA} from '@angular/core';

import {TestBed, async, ComponentFixtureAutoDetect, fakeAsync} from '@angular/core/testing';

import {DashboardPage, Tab} from '../../testing';

import {DashboardComponent} from './dashboard.component';

describe('UpdateFailedComponent', () => {

    let page: DashboardPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardComponent],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new DashboardPage(TestBed.createComponent(DashboardComponent));
        page.detectChanges();
    }));

    it('has tabs with correct lables', fakeAsync(() => {
        expect(page.tabs.length).toBe(3, '3 tabs');
        expect(page.tabs.map((tab: Tab) => tab.label))
            .toEqual(['Margin Requirement Overview', 'Position Level Risk', 'Initial Margin']);
        expect(page.activeTab.label).toEqual('Margin Requirement Overview');
    }));

    it('has correct content in tab panels', fakeAsync(() => {
        expect(page.contains('margin-shortfall-surplus-summary')).toBeTruthy('Shortfall-surplus summary visible');
        expect(page.contains('margin-components-aggregation')).toBeTruthy('Margin components aggergetaion visible');
        expect(page.contains('margin-components-treemap')).toBeFalsy('Margin components treemap not visible');
        expect(page.contains('position-report-bubblechart')).toBeFalsy('Position report bubblechart not visible');

        page.tabs[1].click();

        expect(page.activeTab.label).toEqual('Position Level Risk');
        expect(page.contains('margin-shortfall-surplus-summary')).toBeFalsy('Shortfall-surplus summary not visible');
        expect(page.contains('margin-components-aggregation')).toBeFalsy('Margin components aggergetaion not visible');
        expect(page.contains('margin-components-treemap')).toBeFalsy('Margin components treemap not visible');
        expect(page.contains('position-report-bubblechart')).toBeTruthy('Position report bubblechart visible');

        page.tabs[2].click();

        expect(page.activeTab.label).toEqual('Initial Margin');
        expect(page.contains('margin-shortfall-surplus-summary')).toBeFalsy('Shortfall-surplus summary not visible');
        expect(page.contains('margin-components-aggregation')).toBeFalsy('Margin components aggergetaion not visible');
        expect(page.contains('margin-components-treemap')).toBeTruthy('Margin components treemap visible');
        expect(page.contains('position-report-bubblechart')).toBeFalsy('Position report bubblechart not visible');

        page.tabs[0].click();

        expect(page.activeTab.label).toEqual('Margin Requirement Overview');
        expect(page.contains('margin-shortfall-surplus-summary')).toBeTruthy('Shortfall-surplus summary visible');
        expect(page.contains('margin-components-aggregation')).toBeTruthy('Margin components aggergetaion visible');
        expect(page.contains('margin-components-treemap')).toBeFalsy('Margin components treemap not visible');
        expect(page.contains('position-report-bubblechart')).toBeFalsy('Position report bubblechart not visible');

        page.tabs[2].click();

        expect(page.activeTab.label).toEqual('Initial Margin');
        expect(page.contains('margin-shortfall-surplus-summary')).toBeFalsy('Shortfall-surplus summary not visible');
        expect(page.contains('margin-components-aggregation')).toBeFalsy('Margin components aggergetaion not visible');
        expect(page.contains('margin-components-treemap')).toBeTruthy('Margin components treemap visible');
        expect(page.contains('position-report-bubblechart')).toBeFalsy('Position report bubblechart not visible');

        page.tabs[1].click();

        expect(page.activeTab.label).toEqual('Position Level Risk');
        expect(page.contains('margin-shortfall-surplus-summary')).toBeFalsy('Shortfall-surplus summary not visible');
        expect(page.contains('margin-components-aggregation')).toBeFalsy('Margin components aggergetaion not visible');
        expect(page.contains('margin-components-treemap')).toBeFalsy('Margin components treemap not visible');
        expect(page.contains('position-report-bubblechart')).toBeTruthy('Position report bubblechart visible');
    }));
});