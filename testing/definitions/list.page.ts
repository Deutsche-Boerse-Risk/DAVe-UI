import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {NgModel} from "@angular/forms";

import {ComponentFixture, tick} from "@angular/core/testing";

import {setNgModelValue} from "../events";
import {PageWithLoading} from "./page.base";
import {DataTableDefinition} from "./data.table.definition";


import {ListComponent} from "../../app/list/list.component";
import {DrilldownButtonComponent} from "../../app/list/drilldown.button.component";
import {DownloadMenuComponent} from "../../app/list/download.menu.component";
import {BreadCrumbsComponent} from "../../app/list/bread.crumbs.component";
import {InitialLoadComponent} from "../../app/common/initial.load.component";
import {NoDataComponent} from "../../app/common/no.data.component";
import {UpdateFailedComponent} from "../../app/common/update.failed.component";
import {GoogleLineChart} from "../../app/common/google.line.chart.component";
import {DataTableComponent} from "../../app/datatable/data.table.component";

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

    public get breadCrumbs(): DebugElement {
        return this.header.query(By.directive(BreadCrumbsComponent));
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

    public get dataTable(): DataTableDefinition {
        return new DataTableDefinition(this.listElement.query(By.directive(DataTableComponent)), this.fixture);
    }
}

export class HistoryListPage<T> extends LatestListPage<T> {

    constructor(fixture: ComponentFixture<T>) {
        super(fixture);
    }

    public get lineChart(): DebugElement {
        return this.listElement.query(By.directive(GoogleLineChart))
            || this.listElement.query(By.css('google-line-chart'));
    }
}