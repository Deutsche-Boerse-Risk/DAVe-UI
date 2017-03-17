import {DebugElement, Type,} from '@angular/core';
import {By} from '@angular/platform-browser';
import {NgModel} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {ComponentFixture, tick, TestBed} from '@angular/core/testing';

import {setNgModelValue} from '../events';
import {PageWithLoading} from './page.base';
import {DataTableDefinition} from './data.table.definition';
import {BreadCrumbsDefinition} from './bread.crumbs.page';

import {stubRouter} from '../stubs/router/router.module.stub';
import {HttpAsyncServiceStub} from '../stubs/http.service.stub';
import {GoogleLineChartStub} from '../stubs/google.chart.component.stub';

import {DataTableModule} from '../../app/datatable/data.table.module';
import {ListModule} from '../../app/list/list.module';

import {HttpService} from '../../app/http.service';

import {ListComponent} from '../../app/list/list.component';
import {DrilldownButtonComponent} from '../../app/list/drilldown.button.component';
import {DownloadMenuComponent} from '../../app/list/download.menu.component';
import {BreadCrumbsComponent} from '../../app/list/bread.crumbs.component';
import {InitialLoadComponent} from '../../app/common/initial.load.component';
import {NoDataComponent} from '../../app/common/no.data.component';
import {UpdateFailedComponent} from '../../app/common/update.failed.component';
import {DataTableComponent} from '../../app/datatable/data.table.component';

export class ListPage<T> extends PageWithLoading<T> {

    public debugElement: DebugElement;
    public component: T;

    public listElement: DebugElement;
    private listComponent: ListComponent;

    constructor(fixture: ComponentFixture<T>) {
        super(fixture);
        this.listElement = this.debugElement.query(By.directive(ListComponent));
        this.listComponent = this.listElement.componentInstance;
    }

    public get title(): string {
        return this.listElement.query(By.css('h3')).nativeElement.textContent;
    }

    public get header(): DebugElement {
        return this.listElement.query(By.css('.panel-heading'));
    }

    public get filterGroup(): DebugElement {
        return this.header.query(By.css('.input-group'));
    }

    public get filterShown(): boolean {
        return this.filterGroup !== null;
    }

    public get filterInput(): DebugElement {
        return this.filterGroup.query(By.directive(NgModel));
    }

    public filter(value: string): void {
        setNgModelValue(this.filterInput, value);
        tick(100);
    }

    public get drilldownButton(): DebugElement {
        return this.header.query(By.directive(DrilldownButtonComponent));
    }

    public get downloadMenu(): DebugElement {
        return this.header.query(By.directive(DownloadMenuComponent));
    }

    public get breadCrumbs(): BreadCrumbsDefinition {
        let element = this.header.query(By.directive(BreadCrumbsComponent));
        if (element) {
            return new BreadCrumbsDefinition(this, element);
        }
        return null;
    }

    public get initialLoadComponent(): DebugElement {
        return this.listElement.query(By.directive(InitialLoadComponent));
    }

    public get noDataComponent(): DebugElement {
        return this.listElement.query(By.directive(NoDataComponent));
    }

    public get updateFailedComponent(): DebugElement {
        return this.listElement.query(By.directive(UpdateFailedComponent));
    }
}

export class LatestListPage<T> extends ListPage<T> {

    constructor(fixture: ComponentFixture<T>) {
        super(fixture);
    }

    static initTestBed(component: Type<any>, service: Type<any>) {
        TestBed.configureTestingModule({
            imports: [
                ListModule,
                DataTableModule,
                RouterModule
            ],
            declarations: [
                component
            ],
            providers: [
                service,
                {
                    provide: HttpService, useClass: HttpAsyncServiceStub
                }
            ]
        });
        stubRouter().compileComponents();
    }

    public get dataTable(): DataTableDefinition {
        return new DataTableDefinition(this.listElement.query(By.directive(DataTableComponent)), this);
    }

    public checkBreadCrumbs(routeParams: string[], rootPath: string, rootText: string,
                            firstActive: boolean = true, lastActive: boolean = true): void {
        let crumbs = this.breadCrumbs.crumbs;
        let filteredParams = routeParams.filter((param: string) => param !== '*');

        expect(crumbs.length).toBe(filteredParams.length + 1, (filteredParams.length + 1) + ' displayed.');

        expect(crumbs[0].text).toBe(rootText);
        if (firstActive) {
            expect(crumbs[0].active).toBeTruthy('First active');
            crumbs[0].link.click();
            expect(crumbs[0].link.stub.navigatedTo).toEqual([rootPath], 'Navigation works correctly');
        } else {
            expect(crumbs[0].active).toBeFalsy('First inactive');
        }

        let activeItems = filteredParams.length;
        if (firstActive) {
            activeItems++;
        }
        if (!lastActive && routeParams[routeParams.length - 1] !== '*') {
            activeItems--;
        }
        expect(this.breadCrumbs.active.length).toBe(activeItems, activeItems + ' active');

        let path = [rootPath];
        let j = 0;
        for (let i = 1; i < crumbs.length; i++) {
            expect(crumbs[i].link.text).toBe(filteredParams[i - 1]);
            if (i !== crumbs.length - 1 || lastActive) {
                while (routeParams[j] === '*') {
                    path.push(routeParams[j]);
                    j++;
                }
                path.push(routeParams[j]);
                j++;
                crumbs[i].link.click();
                expect(crumbs[i].link.stub.navigatedTo).toEqual(path, 'Navigation works correctly');
            }
        }
    };
}

export class HistoryListPage<T> extends LatestListPage<T> {

    constructor(fixture: ComponentFixture<T>) {
        super(fixture);
    }

    static initTestBed(component: Type<any>, service: Type<any>) {
        TestBed.configureTestingModule({
            imports: [
                ListModule,
                DataTableModule
            ],
            declarations: [
                GoogleLineChartStub,
                component
            ],
            providers: [
                service,
                {
                    provide: HttpService, useClass: HttpAsyncServiceStub
                }
            ],
            // schemas: [NO_ERRORS_SCHEMA]
        });
        stubRouter().compileComponents();
    }

    public get lineChart(): DebugElement {
        return this.listElement.query(By.directive(GoogleLineChartStub));
    }
}