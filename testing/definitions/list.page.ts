import {DatePipe, DecimalPipe} from '@angular/common';
import {DebugElement, Type} from '@angular/core';
import {By} from '@angular/platform-browser';
import {NgModel} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {MdInputContainer, MdMenuItem, MdToolbarRow} from '@angular/material';

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {
    AuthServiceStub,
    click,
    DataTableDefinition,
    disableMaterialAnimations,
    DownloadLink,
    GoogleLineChartStub,
    HttpAsyncServiceStub,
    MessageComponentDef,
    PageWithLoading,
    RouterStub,
    setNgModelValue,
    stubRouter
} from '@dbg-riskit/dave-ui-testing';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {DATE_FORMAT} from '@dbg-riskit/dave-ui-common';
import {DataTableComponent, DataTableModule, HIGHLIGHTER_TIMEOUT} from '@dbg-riskit/dave-ui-datatable';
import {CSVDownloadMenuComponent, FileModule} from '@dbg-riskit/dave-ui-file';
import {HttpService} from '@dbg-riskit/dave-ui-http';
import {DateFormatter, INITIAL_LOAD_SELECTOR, NO_DATA_SELECTOR, UPDATE_FAILED_SELECTOR} from '@dbg-riskit/dave-ui-view';

import {BreadCrumbsDefinition} from './bread.crumbs.page';

import {ListModule} from '../../app/list/list.module';
import {FILTER_TIMEOUT, ListComponent} from '../../app/list/list.component';
import {DrillUpDownButtonComponent} from '../../app/list/drill.updown.button.component';
import {BreadCrumbsComponent} from '../../app/list/bread.crumbs.component';

import {ErrorCollectorService} from '../../app/error.collector';
import {PeriodicHttpService} from '../../app/periodic.http.service';

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
        return this.listElement.query(By.directive(MdToolbarRow));
    }

    public get filterGroup(): DebugElement {
        return this.header.query(By.directive(MdInputContainer));
    }

    public get filterShown(): boolean {
        return this.filterGroup !== null;
    }

    public get filterInput(): DebugElement {
        return this.filterGroup.query(By.directive(NgModel));
    }

    public filter(value: string): void {
        setNgModelValue(this.filterInput, value);
        this.advanceAndDetectChanges(FILTER_TIMEOUT + HIGHLIGHTER_TIMEOUT);
    }

    public get drilldownButton(): DebugElement {
        return this.header.queryAll(By.directive(DrillUpDownButtonComponent))
            .find((element: DebugElement) =>
                !(element.componentInstance as DrillUpDownButtonComponent).drillUp) || null;
    }

    public get drillupButton(): DebugElement {
        return this.header.queryAll(By.directive(DrillUpDownButtonComponent))
            .find((element: DebugElement) =>
                (element.componentInstance as DrillUpDownButtonComponent).drillUp) || null;
    }

    public get downloadMenu(): DownloadLink {
        let downLoadMenu: DebugElement = this.header.query(By.directive(CSVDownloadMenuComponent));
        if (downLoadMenu) {
            // Open the menu first
            click(downLoadMenu.query(By.css('a')));
            this.detectChanges(500);
            return new DownloadLink(downLoadMenu.query(By.directive(MdMenuItem)), this);
        }
        return null;
    }

    public get breadCrumbs(): BreadCrumbsDefinition {
        let element = this.header.query(By.directive(BreadCrumbsComponent));
        if (element) {
            return new BreadCrumbsDefinition(this, element);
        }
        return null;
    }

    public get initialLoadComponent(): MessageComponentDef {
        const element = this.listElement.query(By.css(INITIAL_LOAD_SELECTOR));
        if (element) {
            return new MessageComponentDef(element);
        }
        return null;
    }

    public get noDataComponent(): MessageComponentDef {
        const element = this.listElement.query(By.css(NO_DATA_SELECTOR));
        if (element) {
            return new MessageComponentDef(element);
        }
        return null;
    }

    public get updateFailedComponent(): MessageComponentDef {
        const element = this.listElement.query(By.css(UPDATE_FAILED_SELECTOR));
        if (element) {
            return new MessageComponentDef(element);
        }
        return null;
    }
}

export class LatestListPage<T> extends ListPage<T> {

    constructor(fixture: ComponentFixture<T>) {
        super(fixture);
    }

    static initTestBed(component: Type<any>, service: Type<any>): Promise<any> {
        TestBed.configureTestingModule({
            imports     : [
                ListModule,
                DataTableModule,
                RouterModule
            ],
            declarations: [
                component
            ],
            providers   : [
                service,
                {
                    provide : HttpService,
                    useClass: HttpAsyncServiceStub
                },
                PeriodicHttpService,
                ErrorCollectorService,
                {
                    provide : AuthService,
                    useClass: AuthServiceStub
                }
            ]
        });
        disableMaterialAnimations(ListModule);
        disableMaterialAnimations(FileModule);
        disableMaterialAnimations(DataTableModule);
        return stubRouter().compileComponents();
    }

    public advanceHighlighter(): void {
        this.advanceAndDetectChanges(HIGHLIGHTER_TIMEOUT);
    }

    public get dataTable(): DataTableDefinition {
        return new DataTableDefinition(this.listElement.query(By.directive(DataTableComponent)), this);
    }

    public checkBreadCrumbs(routeParams: string[], rootPath: string, rootText: string,
        firstActive: boolean = true, lastNInactive: number = 0): void {
        // Get router stub
        let router: RouterStub = TestBed.get(RouterStub);
        let routerSpy = spyOn(router, 'navigate');

        let crumbs = this.breadCrumbs.crumbs;
        let filteredParams = routeParams.filter((param: string) => param !== '*');

        expect(crumbs.length).toBe(filteredParams.length + 1, (filteredParams.length + 1) + ' displayed.');

        expect(crumbs[0].text).toBe(rootText);
        if (firstActive) {
            expect(crumbs[0].active).toBeTruthy('First active');
            crumbs[0].click();
            expect(routerSpy.calls.mostRecent().args).toEqual([rootPath], 'Navigation works correctly');
        } else {
            expect(crumbs[0].active).toBeFalsy('First inactive');
        }

        let activeItems = filteredParams.length;
        if (firstActive) {
            activeItems++;
        }
        for (let i = 1; i <= lastNInactive; i++) {
            if (routeParams[routeParams.length - i] !== '*') {
                activeItems--;
            }
        }
        expect(this.breadCrumbs.active.length).toBe(activeItems, activeItems + ' active');

        let path = [rootPath];
        let j = 0;
        for (let i = 1; i < crumbs.length; i++) {
            expect(crumbs[i].text).toBe(filteredParams[i - 1]);
            if (i < crumbs.length - lastNInactive) {
                while (routeParams[j] === '*') {
                    path.push(routeParams[j]);
                    j++;
                }
                path.push(routeParams[j]);
                j++;
                crumbs[i].click();
                expect(routerSpy.calls.mostRecent().args[0]).toEqual(path, 'Navigation works correctly');
            }
        }
    };
}

export class HistoryListPage<T> extends LatestListPage<T> {

    constructor(fixture: ComponentFixture<T>) {
        super(fixture);
    }

    static initTestBed(component: Type<any>, service: Type<any>): Promise<any> {
        TestBed.configureTestingModule({
            imports     : [
                ListModule,
                DataTableModule
            ],
            declarations: [
                GoogleLineChartStub,
                component
            ],
            providers   : [
                service,
                {
                    provide : HttpService,
                    useClass: HttpAsyncServiceStub
                },
                PeriodicHttpService,
                ErrorCollectorService,
                {
                    provide : AuthService,
                    useClass: AuthServiceStub
                },
                DecimalPipe,
                DatePipe,
                DateFormatter,
                {
                    provide : DATE_FORMAT,
                    useValue: 'dd. MM. yyyy HH:mm:ss'
                }
            ]
            // schemas: [NO_ERRORS_SCHEMA]
        });
        disableMaterialAnimations(ListModule);
        disableMaterialAnimations(FileModule);
        disableMaterialAnimations(DataTableModule);
        return stubRouter().compileComponents();
    }

    public get lineChart(): DebugElement {
        return this.listElement.query(By.directive(GoogleLineChartStub));
    }
}