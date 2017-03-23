import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture, tick} from '@angular/core/testing';

import {FAKE_HTTP_ASYNC_TIMEOUT} from '../stubs/http.service.stub';

import {InitialLoadComponent} from '../../app/common/initial.load.component';
import {NoDataComponent} from '../../app/common/no.data.component';
import {UpdateFailedComponent} from '../../app/common/update.failed.component';

export class Page<T> {

    public debugElement: DebugElement;
    public component: T;
    private _timeOffset: number = 0;

    constructor(protected fixture: ComponentFixture<T>) {
        this.debugElement = fixture.debugElement;
        this.component = this.debugElement.componentInstance;
    }

    public detectChanges(millis: number = 0): void {
        this.fixture.detectChanges();
        tick(millis);
        this._timeOffset += millis;
    }

    public advanceAndDetectChanges(millis: number = 0): void {
        tick(millis);
        this._timeOffset += millis;
        this.detectChanges();
    }

    public advanceHTTP(): void {
        this.advanceAndDetectChanges(FAKE_HTTP_ASYNC_TIMEOUT);
    }

    public advanceAndDetectChangesUsingOffset(millis: number): void {
        this.advanceAndDetectChanges(millis - this._timeOffset);
        this.resetTimeOffset();
    }

    public resetTimeOffset(): void {
        this._timeOffset = 0;
    }
}

export class PageWithLoading<T> extends Page<T> {


    constructor(fixture: ComponentFixture<T>) {
        super(fixture);
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