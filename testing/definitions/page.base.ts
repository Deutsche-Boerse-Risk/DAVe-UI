import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

import {ComponentFixture, tick} from "@angular/core/testing";

import {InitialLoadComponent} from "../../app/common/initial.load.component";
import {NoDataComponent} from "../../app/common/no.data.component";
import {UpdateFailedComponent} from "../../app/common/update.failed.component";

export class Page<T> {

    public debugElement: DebugElement;
    public component: T;

    constructor(protected fixture: ComponentFixture<T>) {
        this.debugElement = fixture.debugElement;
        this.component = this.debugElement.componentInstance;
    }

    public detectChanges(millis: number = 0): void {
        this.fixture.detectChanges();
        tick(millis);
    }

    public advance(millis: number = 0): void {
        tick(millis);
        this.detectChanges();
    }
}

export class PageWithLoading<T> extends Page<T> {


    constructor(fixture: ComponentFixture<T>) {
        super(fixture);
    }

    public detectChanges(millis: number = 0): void {
        this.fixture.detectChanges();
        tick(millis);
    }

    public get initialLoadComponent(): DebugElement {
        return this.debugElement.query(By.directive(InitialLoadComponent));
    }

    public get noDataComponent(): DebugElement {
        return this.debugElement.query(By.directive(NoDataComponent));
    }

    public get updateFailedComponent(): DebugElement {
        return this.debugElement.query(By.directive(UpdateFailedComponent));
    }
}