import {Component} from "@angular/core";
import {By} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";

import {TestBed, async, ComponentFixtureAutoDetect, fakeAsync} from "@angular/core/testing";

import {RouterLinkStubDirective, ListPage} from "../../testing";

import {ListModule} from "./list.module";
import {RoutePart} from "./bread.crumbs.component";

@Component({
    template: `
<list-content [title]="rootRouteTitle"
              [isHistory]="isHistory"
              [routeParts]="routeParts"
              [exportKeys]="exportKeys"
              [data]="data"
              [initialLoad]="initialLoad"
              [errorMessage]="errorMessage"
              [drilldownRouterLink]="drilldownRouterLink"
              (filterChanged)="filtered($event)">
    <div class="testContent"></div>
</list-content>`
})
class TestComponent {
    public rootRouteTitle: string = 'Test title';
    public isHistory: boolean = false;
    public routeParts: RoutePart[] = [];
    public exportKeys: string[] = [];
    public data: any[];
    public initialLoad: boolean;
    public errorMessage: string;
    public drilldownRouterLink: any[] | string;

    public filtered(query: string): string {
        return query;
    }
}

describe('ListComponent', () => {

    let page: ListPage<TestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ListModule],
            declarations: [TestComponent],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).overrideModule(RouterModule, {
            set: {
                declarations: [RouterLinkStubDirective],
                exports: [RouterLinkStubDirective]
            }
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new ListPage<TestComponent>(TestBed.createComponent(TestComponent));

        page.detectChanges();
    }));

    it('has correct title', () => {
        expect(page.title).toBe(page.component.rootRouteTitle);
    });

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

        page.component.drilldownRouterLink = ['/positionReportLatest', 'clearer'];
        page.detectChanges();

        expect(page.drilldownButton).not.toBeNull('Is shown');
    }));

    it('has download menu', () => {
        expect(page.downloadMenu).not.toBeNull('Is shown');
    });

    it('has bread crumbs', () => {
        expect(page.breadCrumbs).not.toBeNull('Is shown');
    });

    it('initial load message works as expected', fakeAsync(() => {
        expect(page.initialLoadComponent).toBeNull('Not shown');

        page.component.initialLoad = true;
        page.detectChanges();

        expect(page.initialLoadComponent).not.toBeNull('Is shown');

        page.component.errorMessage = 'Error';
        page.detectChanges();

        expect(page.initialLoadComponent).toBeNull('Not shown');
    }));

    it('no data message works as expected', fakeAsync(() => {
        expect(page.noDataComponent).not.toBeNull('Is shown');

        page.component.initialLoad = true;
        page.detectChanges();

        expect(page.noDataComponent).toBeNull('Not shown');

        page.component.initialLoad = false;
        page.component.errorMessage = 'Error';
        page.detectChanges();

        expect(page.noDataComponent).toBeNull('Not shown');

        page.component.initialLoad = false;
        delete page.component.errorMessage;
        page.detectChanges();

        expect(page.noDataComponent).not.toBeNull('Is shown');

        page.component.data = [1, 2, 3, 4, 5];
        page.detectChanges();

        expect(page.noDataComponent).toBeNull('Not shown');
    }));

    it('error message works as expected', fakeAsync(() => {
        expect(page.updateFailedComponent).toBeNull('Not shown');

        page.component.initialLoad = true;
        page.detectChanges();

        expect(page.updateFailedComponent).toBeNull('Not shown');

        page.component.errorMessage = 'Error';
        page.detectChanges();

        expect(page.updateFailedComponent).not.toBeNull('Is shown');

        page.component.initialLoad = false;
        page.detectChanges();

        expect(page.updateFailedComponent).not.toBeNull('Is shown');

        page.component.data = [1, 2, 3, 4, 5];
        page.detectChanges();

        expect(page.updateFailedComponent).not.toBeNull('Is shown');
    }));

    it('has content', () => {
        expect(page.listElement.query(By.css('.testContent'))).not.toBeNull('Is shown');
    });
});