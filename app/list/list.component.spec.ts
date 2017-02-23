import {DebugElement, Component} from "@angular/core";
import {By} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";

import {ComponentFixture, TestBed, async, ComponentFixtureAutoDetect, fakeAsync, tick} from "@angular/core/testing";

import {RouterLinkStubDirective} from "../../testing/router.link.stub";
import {setNgModelValue} from "../../testing/index";

import {ListModule} from "./list.module";
import {ListComponent} from "./list.component";
import {RoutePart, BreadCrumbsComponent} from "./bread.crumbs.component";
import {DrilldownButtonComponent} from "./drilldown.button.component";
import {DownloadMenuComponent} from "./download.menu.component";
import {InitialLoadComponent} from "../common/initial.load.component";
import {NoDataComponent} from "../common/no.data.component";
import {UpdateFailedComponent} from "../common/update.failed.component";

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

    let hostComp: TestComponent;
    let comp: ListComponent;
    let fixture: ComponentFixture<TestComponent>;
    let de: DebugElement;

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
        fixture = TestBed.createComponent(TestComponent);

        hostComp = fixture.componentInstance;
        de = fixture.debugElement.query(By.directive(ListComponent));
        comp = de.injector.get(ListComponent);
        fixture.detectChanges();
        tick();
    }));

    it('has correct title', () => {
        expect(de.query(By.css('h3')).nativeElement.textContent).toBe(hostComp.rootRouteTitle);
    });

    it('displays filter and filter works correctly', fakeAsync(() => {
        expect(de.query(By.css('.panel-heading')).query(By.css('.input-group'))).not.toBeNull('Filter is shown');

        let filterSpy = spyOn(hostComp, 'filtered');

        setNgModelValue(de.query(By.css('.form-control')), 'Filter query');
        tick(100);

        expect(filterSpy).toHaveBeenCalledWith('Filter query');

        hostComp.isHistory = true;
        fixture.detectChanges();

        expect(de.query(By.css('.input-group'))).toBeNull('Filter is not shown');
    }));

    it('displays drilldown-button', () => {
        expect(de.query(By.css('.panel-heading')).query(By.directive(DrilldownButtonComponent))).toBeNull('Not shown');

        hostComp.drilldownRouterLink = ['/positionReportLatest', 'clearer'];
        fixture.detectChanges();

        expect(de.query(By.css('.panel-heading')).query(By.directive(DrilldownButtonComponent))).not.toBeNull('Is shown');
    });

    it('has download menu', () => {
        expect(de.query(By.css('.panel-heading')).query(By.directive(DownloadMenuComponent))).not.toBeNull('Is shown');
    });

    it('has bread crumbs', () => {
        expect(de.query(By.css('.panel-heading')).query(By.directive(BreadCrumbsComponent))).not.toBeNull('Is shown');
    });

    it('initial load message works as expected', () => {
        expect(de.query(By.directive(InitialLoadComponent))).toBeNull('Not shown');

        hostComp.initialLoad = true;
        fixture.detectChanges();

        expect(de.query(By.directive(InitialLoadComponent))).not.toBeNull('Is shown');

        hostComp.errorMessage = 'Error';
        fixture.detectChanges();

        expect(de.query(By.directive(InitialLoadComponent))).toBeNull('Not shown');
    });

    it('no data message works as expected', () => {
        expect(de.query(By.directive(NoDataComponent))).not.toBeNull('Is shown');

        hostComp.initialLoad = true;
        fixture.detectChanges();

        expect(de.query(By.directive(NoDataComponent))).toBeNull('Not shown');

        hostComp.initialLoad = false;
        hostComp.errorMessage = 'Error';
        fixture.detectChanges();

        expect(de.query(By.directive(NoDataComponent))).toBeNull('Not shown');

        hostComp.initialLoad = false;
        delete hostComp.errorMessage;
        fixture.detectChanges();

        expect(de.query(By.directive(NoDataComponent))).not.toBeNull('Is shown');

        hostComp.data = [1, 2, 3, 4, 5];
        fixture.detectChanges();

        expect(de.query(By.directive(NoDataComponent))).toBeNull('Not shown');
    });

    it('error message works as expected', () => {
        expect(de.query(By.directive(UpdateFailedComponent))).toBeNull('Not shown');

        hostComp.initialLoad = true;
        fixture.detectChanges();

        expect(de.query(By.directive(UpdateFailedComponent))).toBeNull('Not shown');

        hostComp.errorMessage = 'Error';
        fixture.detectChanges();

        expect(de.query(By.directive(UpdateFailedComponent))).not.toBeNull('Is shown');

        hostComp.initialLoad = false;
        fixture.detectChanges();

        expect(de.query(By.directive(UpdateFailedComponent))).not.toBeNull('Is shown');

        hostComp.data = [1, 2, 3, 4, 5];
        fixture.detectChanges();

        expect(de.query(By.directive(UpdateFailedComponent))).not.toBeNull('Is shown');
    });

    it('has content', () => {
        expect(de.query(By.css('.testContent'))).not.toBeNull('Is shown');
    });
});