import {ChangeDetectorRef, Component} from '@angular/core';
import {By} from '@angular/platform-browser';

import {fakeAsync, TestBed} from '@angular/core/testing';

import {compileTestBed, disableMaterialAnimations, stubRouter} from '@dbg-riskit/dave-ui-testing';

import {DATE_FORMAT} from '@dbg-riskit/dave-ui-common';
import {FileModule} from '@dbg-riskit/dave-ui-file';

import {ListPage} from '@dave/testing';

import {ListModule} from './list.module';
import {RoutePart} from './bread.crumbs.component';
import {ROUTES} from '../routes/routing.paths';
import {DataTableComponent} from '@dbg-riskit/dave-ui-datatable';

@Component({
    template: `
        <list-content [header]="rootRouteTitle"
                      [isHistory]="isHistory"
                      [routeParts]="routeParts"
                      [exportKeys]="exportKeys"
                      [dataTable]="dataTable"
                      [initialLoad]="initialLoad"
                      [drilldownRouterLink]="drilldownRouterLink"
                      [drillupRouterLink]="drillupRouterLink"
                      (filterChanged)="filtered($event)">
            <div class="testContent"></div>
        </list-content>`
})
class TestComponent {
    public rootRouteTitle: string = 'Test title';
    public isHistory: boolean = false;
    public routeParts: RoutePart[] = [];
    public exportKeys: string[] = [];
    public dataTable: DataTableComponent;
    public initialLoad: boolean;
    public drilldownRouterLink: any[] | string;
    public drillupRouterLink: any[] | string;

    constructor(_changeDetectorRef: ChangeDetectorRef) {
        this.dataTable = new DataTableComponent(_changeDetectorRef);
    }

    public set data(rows: any[]) {
        this.dataTable.data = rows;
    }

    public filtered(query: string): string {
        return query;
    }
}

describe('ListComponent', () => {

    let page: ListPage<TestComponent>;

    compileTestBed(() => {
        TestBed.configureTestingModule({
            imports     : [ListModule],
            declarations: [TestComponent],
            providers   : [
                {
                    provide : DATE_FORMAT,
                    useValue: 'dd. MM. yyyy HH:mm:ss'
                }
            ]
        });
        disableMaterialAnimations(ListModule);
        disableMaterialAnimations(FileModule);
        return stubRouter().compileComponents();
    }, () => {
        page.destroy();
        page = null;
    });

    beforeEach(fakeAsync(() => {
        page = new ListPage<TestComponent>(TestBed.createComponent(TestComponent));
        page.detectChanges();
    }));

    it('has correct title', fakeAsync(() => {
        expect(page.title).toBe(page.component.rootRouteTitle);
    }));

    it('displays filter and filter works correctly', fakeAsync(() => {
        expect(page.filterShown).toBeTruthy('Filter is shown');

        let filterSpy = spyOn(page.component, 'filtered');

        page.filter('Filter query');

        expect(filterSpy).toHaveBeenCalledWith('Filter query');

        page.component.isHistory = true;
        page.detectChanges();

        expect(page.filterShown).toBeFalsy('Filter is not shown');
    }));

    it('displays drilldown-button', fakeAsync(() => {
        expect(page.drilldownButton).toBeNull('Not shown');

        page.component.drilldownRouterLink = [ROUTES.POSITION_REPORTS_LATEST, 'clearer'];
        page.detectChanges();

        expect(page.drilldownButton).not.toBeNull('Is shown');
    }));

    it('displays drillup-button', fakeAsync(() => {
        expect(page.drillupButton).toBeNull('Not shown');

        page.component.drillupRouterLink = [ROUTES.POSITION_REPORTS_LATEST, 'clearer'];
        page.detectChanges();

        expect(page.drillupButton).not.toBeNull('Is shown');
    }));

    it('has download menu', fakeAsync(() => {
        expect(page.downloadMenu).not.toBeNull('Is shown');
    }));

    it('has bread crumbs', fakeAsync(() => {
        expect(page.breadCrumbs).not.toBeNull('Is shown');
    }));

    it('initial load message works as expected', fakeAsync(() => {
        expect(page.initialLoadComponent).toBeNull('Not shown');

        page.component.initialLoad = true;
        page.detectChanges();

        expect(page.initialLoadComponent).not.toBeNull('Is shown');
    }));

    it('no data message works as expected', fakeAsync(() => {
        expect(page.noDataComponent).not.toBeNull('Is shown');

        page.component.initialLoad = true;
        page.detectChanges();

        expect(page.noDataComponent).toBeNull('Not shown');

        page.component.data = [1, 2, 3, 4, 5];
        page.detectChanges();

        expect(page.noDataComponent).toBeNull('Not shown');
    }));

    it('has content', fakeAsync(() => {
        expect(page.listElement.query(By.css('.testContent'))).not.toBeNull('Is shown');
    }));
});