import {BrowserModule} from '@angular/platform-browser';
import {Router, RouterModule} from '@angular/router';

import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {compileTestBed, RouterStub, stubRouter} from '@dbg-riskit/dave-ui-testing';

import {NoopAnimationsCommonViewModule} from '@dbg-riskit/dave-ui-view';

import {BreadCrumbsPage, Crumb, TestBreadCrumbsComponent} from '@dave/testing';

import {BreadCrumbsComponent} from './bread.crumbs.component';

describe('BreadCrumbsComponent', () => {

    let page: BreadCrumbsPage;

    compileTestBed(() => {
        TestBed.configureTestingModule({
            imports     : [
                BrowserModule,
                RouterModule,
                NoopAnimationsCommonViewModule
            ],
            declarations: [
                TestBreadCrumbsComponent,
                BreadCrumbsComponent
            ]
        });
        return stubRouter().compileComponents();
    }, () => {
        page = null;
    });

    beforeEach(fakeAsync(() => {
        page = new BreadCrumbsPage(TestBed.createComponent(TestBreadCrumbsComponent));
        page.detectChanges();
    }));

    it('displays correct bread crumbs and filteres correctly', fakeAsync(() => {
        let breadCrumbs = page.breadCrumbs;
        let crumbs = breadCrumbs.crumbs;
        expect(crumbs.length).toBe(0, 'Nothing displayed.');

        // Add Root item
        page.component.routeParts = [
            {
                title    : 'RootItem',
                routePart: '/root'
            }
        ];
        page.detectChanges();

        breadCrumbs = page.breadCrumbs;
        crumbs = breadCrumbs.crumbs;
        expect(crumbs.length).toBe(1, 'First displayed.');
        expect(crumbs[0].text).toEqual('RootItem', 'Title of first item is correct.');
        expect(crumbs[0].active).toBeTruthy('First item is active.');
        expect(crumbs[0].primary).toBeTruthy('First is selected');

        // Add Item 1
        page.component.routeParts = page.component.routeParts.concat({
            title    : 'Item1',
            routePart: 'item1'
        });
        page.detectChanges();

        breadCrumbs = page.breadCrumbs;
        crumbs = breadCrumbs.crumbs;
        expect(crumbs.length).toBe(2, 'First two displayed.');
        expect(crumbs[0].text).toEqual('RootItem', 'Title of first item is correct.');
        expect(crumbs[0].active).toBeTruthy('First item is active.');
        expect(crumbs[0].primary).toBeTruthy('First is selected');
        expect(crumbs[1].text).toEqual('Item1', 'Title of second item is correct.');
        expect(crumbs[1].active).toBeTruthy('Second item is active.');
        expect(crumbs[1].primary).toBeFalsy('If not first, not selected.');

        // Add Item 2
        page.component.routeParts = page.component.routeParts.concat({
            title    : 'Item2',
            routePart: 'item2'
        });
        page.detectChanges();

        breadCrumbs = page.breadCrumbs;
        crumbs = breadCrumbs.crumbs;
        expect(crumbs.length).toBe(3, 'First three displayed.');
        expect(crumbs[0].text).toEqual('RootItem', 'Title of first item is correct.');
        expect(crumbs[0].active).toBeTruthy('First item is active.');
        expect(crumbs[0].primary).toBeTruthy('First is selected');
        expect(crumbs[1].text).toEqual('Item1', 'Title of second item is correct.');
        expect(crumbs[1].active).toBeTruthy('Second item is active.');
        expect(crumbs[1].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[2].text).toEqual('Item2', 'Title of third item is correct.');
        expect(crumbs[2].active).toBeTruthy('Third item is active.');
        expect(crumbs[2].primary).toBeFalsy('If not first, not selected.');

        // Add Item 3
        page.component.routeParts = page.component.routeParts.concat({
            title    : 'Item3',
            routePart: 'item3'
        });
        page.detectChanges();

        breadCrumbs = page.breadCrumbs;
        crumbs = breadCrumbs.crumbs;
        expect(crumbs.length).toBe(4, 'First four displayed.');
        expect(crumbs[0].text).toEqual('RootItem', 'Title of first item is correct.');
        expect(crumbs[0].active).toBeTruthy('First item is active.');
        expect(crumbs[0].primary).toBeTruthy('First is selected');
        expect(crumbs[1].text).toEqual('Item1', 'Title of second item is correct.');
        expect(crumbs[1].active).toBeTruthy('Second item is active.');
        expect(crumbs[1].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[2].text).toEqual('Item2', 'Title of third item is correct.');
        expect(crumbs[2].active).toBeTruthy('Third item is active.');
        expect(crumbs[2].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[3].text).toEqual('Item3', 'Title of fourth item is correct.');
        expect(crumbs[3].active).toBeTruthy('Fourth item is active.');
        expect(crumbs[3].primary).toBeFalsy('If not first, not selected.');

        // Filter out Item 1
        page.component.routeParts = page.component.routeParts.slice();
        page.component.routeParts[1].title = '*';
        page.detectChanges();

        breadCrumbs = page.breadCrumbs;
        crumbs = breadCrumbs.crumbs;
        expect(crumbs.length).toBe(3, 'First three displayed.');
        expect(crumbs[0].text).toEqual('RootItem', 'Title of first item is correct.');
        expect(crumbs[0].active).toBeTruthy('First item is active.');
        expect(crumbs[0].primary).toBeTruthy('First is selected');
        expect(crumbs[1].text).toEqual('Item2', 'Title of second item is correct.');
        expect(crumbs[1].active).toBeTruthy('Second item is active.');
        expect(crumbs[1].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[2].text).toEqual('Item3', 'Title of third item is correct.');
        expect(crumbs[2].active).toBeTruthy('Third item is active.');
        expect(crumbs[2].primary).toBeFalsy('If not first, not selected.');

        // Filter out Item 3
        page.component.routeParts = page.component.routeParts.slice();
        page.component.routeParts[3].title = '*';
        page.detectChanges();

        breadCrumbs = page.breadCrumbs;
        crumbs = breadCrumbs.crumbs;
        expect(crumbs.length).toBe(2, 'First two displayed.');
        expect(crumbs[0].text).toEqual('RootItem', 'Title of first item is correct.');
        expect(crumbs[0].active).toBeTruthy('First item is active.');
        expect(crumbs[0].primary).toBeTruthy('First is selected');
        expect(crumbs[1].text).toEqual('Item2', 'Title of second item is correct.');
        expect(crumbs[1].active).toBeTruthy('Second item is active.');
        expect(crumbs[1].primary).toBeFalsy('If not first, not selected.');

        // Filter out Root item
        page.component.routeParts = page.component.routeParts.slice();
        page.component.routeParts[0].title = '*';
        page.detectChanges();

        breadCrumbs = page.breadCrumbs;
        crumbs = breadCrumbs.crumbs;
        expect(crumbs.length).toBe(1, 'First displayed.');
        expect(crumbs[0].text).toEqual('Item2', 'Title of first item is correct.');
        expect(crumbs[0].active).toBeTruthy('First item is active.');
        expect(crumbs[0].primary).toBeTruthy('First is selected');
    }));

    it('displays inactive items', fakeAsync(() => {
        // Add Root item
        page.component.routeParts = [
            {
                title    : 'RootItem',
                routePart: '/root'
            },
            {
                title    : 'Item1',
                routePart: 'item1'
            },
            {
                title    : 'Item2',
                routePart: 'item2'
            },
            {
                title    : 'Item3',
                routePart: 'item3'
            }
        ];
        page.detectChanges();

        let breadCrumbs = page.breadCrumbs;
        let crumbs = breadCrumbs.crumbs;
        expect(crumbs.length).toBe(4, 'First four displayed.');
        expect(breadCrumbs.inactive.length).toBe(0, '0 inactive');
        expect(breadCrumbs.active.length).toBe(4, '4 active');

        expect(crumbs[0].text).toEqual('RootItem', 'Title of first item is correct.');
        expect(crumbs[0].primary).toBeTruthy('First is selected');
        expect(crumbs[0].active).toBeTruthy('First item is active.');
        expect(crumbs[1].text).toEqual('Item1', 'Title of second item is correct.');
        expect(crumbs[1].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[1].active).toBeTruthy('Second item is active.');
        expect(crumbs[2].text).toEqual('Item2', 'Title of third item is correct.');
        expect(crumbs[2].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[2].active).toBeTruthy('Third item is active.');
        expect(crumbs[3].text).toEqual('Item3', 'Title of fourth item is correct.');
        expect(crumbs[3].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[3].active).toBeTruthy('Fourth item is active.');

        // Set Root as inactive
        page.component.routeParts = page.component.routeParts.slice();
        page.component.routeParts[0].inactive = true;
        page.detectChanges();

        breadCrumbs = page.breadCrumbs;
        crumbs = breadCrumbs.crumbs;
        expect(crumbs.length).toBe(4, 'First four displayed.');
        expect(breadCrumbs.inactive.length).toBe(1, '1 inactive');
        expect(breadCrumbs.active.length).toBe(3, '3 active');

        expect(crumbs[0].text).toEqual('RootItem', 'Title of first item is correct.');
        expect(crumbs[0].primary).toBeTruthy('First is selected');
        expect(crumbs[0].active).toBeFalsy('First item is inactive.');
        expect(crumbs[1].text).toEqual('Item1', 'Title of second item is correct.');
        expect(crumbs[1].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[1].active).toBeTruthy('Second item is active.');
        expect(crumbs[2].text).toEqual('Item2', 'Title of third item is correct.');
        expect(crumbs[2].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[2].active).toBeTruthy('Third item is active.');
        expect(crumbs[3].text).toEqual('Item3', 'Title of fourth item is correct.');
        expect(crumbs[3].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[3].active).toBeTruthy('Fourth item is active.');

        // Set First item as inactive
        page.component.routeParts = page.component.routeParts.slice();
        page.component.routeParts[1].inactive = true;
        page.detectChanges();

        breadCrumbs = page.breadCrumbs;
        crumbs = breadCrumbs.crumbs;
        expect(crumbs.length).toBe(4, 'First four displayed.');
        expect(breadCrumbs.inactive.length).toBe(2, '2 inactive');
        expect(breadCrumbs.active.length).toBe(2, '2 active');

        expect(crumbs[0].text).toEqual('RootItem', 'Title of first item is correct.');
        expect(crumbs[0].primary).toBeTruthy('First is selected');
        expect(crumbs[0].active).toBeFalsy('First item is inactive.');
        expect(crumbs[1].text).toEqual('Item1', 'Title of second item is correct.');
        expect(crumbs[1].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[1].active).toBeFalsy('Second item is inactive.');
        expect(crumbs[2].text).toEqual('Item2', 'Title of third item is correct.');
        expect(crumbs[2].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[2].active).toBeTruthy('Third item is active.');
        expect(crumbs[3].text).toEqual('Item3', 'Title of fourth item is correct.');
        expect(crumbs[3].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[3].active).toBeTruthy('Fourth item is active.');

        // Set Second item as inactive
        page.component.routeParts = page.component.routeParts.slice();
        page.component.routeParts[2].inactive = true;
        page.detectChanges();

        breadCrumbs = page.breadCrumbs;
        crumbs = breadCrumbs.crumbs;
        expect(crumbs.length).toBe(4, 'First four displayed.');
        expect(breadCrumbs.inactive.length).toBe(3, '3 inactive');
        expect(breadCrumbs.active.length).toBe(1, '1 active');

        expect(crumbs[0].text).toEqual('RootItem', 'Title of first item is correct.');
        expect(crumbs[0].primary).toBeTruthy('First is selected');
        expect(crumbs[0].active).toBeFalsy('First item is inactive.');
        expect(crumbs[1].text).toEqual('Item1', 'Title of second item is correct.');
        expect(crumbs[1].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[1].active).toBeFalsy('Second item is inactive.');
        expect(crumbs[2].text).toEqual('Item2', 'Title of third item is correct.');
        expect(crumbs[2].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[2].active).toBeFalsy('Third item is inactive.');
        expect(crumbs[3].text).toEqual('Item3', 'Title of fourth item is correct.');
        expect(crumbs[3].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[3].active).toBeTruthy('Fourth item is active.');

        // Set Second item as inactive
        page.component.routeParts = page.component.routeParts.slice();
        page.component.routeParts[3].inactive = true;
        page.detectChanges();

        breadCrumbs = page.breadCrumbs;
        crumbs = breadCrumbs.crumbs;
        expect(crumbs.length).toBe(4, 'First four displayed.');
        expect(breadCrumbs.inactive.length).toBe(4, '4 inactive');
        expect(breadCrumbs.active.length).toBe(0, '0 active');

        expect(crumbs[0].text).toEqual('RootItem', 'Title of first item is correct.');
        expect(crumbs[0].primary).toBeTruthy('First is selected');
        expect(crumbs[0].active).toBeFalsy('First item is inactive.');
        expect(crumbs[1].text).toEqual('Item1', 'Title of second item is correct.');
        expect(crumbs[1].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[1].active).toBeFalsy('Second item is inactive.');
        expect(crumbs[2].text).toEqual('Item2', 'Title of third item is correct.');
        expect(crumbs[2].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[2].active).toBeFalsy('Third item is inactive.');
        expect(crumbs[3].text).toEqual('Item3', 'Title of fourth item is correct.');
        expect(crumbs[3].primary).toBeFalsy('If not first, not selected.');
        expect(crumbs[3].active).toBeFalsy('Fourth item is inactive.');
    }));

    it('navigates correctly', fakeAsync(inject([Router], (router: RouterStub) => {
        // Add Root item
        page.component.routeParts = [
            {
                title    : 'RootItem',
                routePart: '/root'
            },
            {
                title    : 'Item1',
                routePart: 'item1'
            },
            {
                title    : 'Item2',
                routePart: 'item2'
            },
            {
                title    : 'Item3',
                routePart: 'item3'
            }
        ];
        page.detectChanges();

        let breadCrumbs = page.breadCrumbs;
        let crumbs = breadCrumbs.crumbs;
        expect(breadCrumbs.active.length).toBe(4, '4 active');
        expect(breadCrumbs.inactive.length).toBe(0, '0 inactive');

        let routerSpy = spyOn(router, 'navigate');
        crumbs.forEach((link: Crumb, index: number) => {
            link.click();

            expect(routerSpy.calls.mostRecent().args[0].length).toBe(index + 1);
            expect(routerSpy.calls.mostRecent().args[0][index]).toEqual(page.component.routeParts[index].routePart);
        });
    })));
});