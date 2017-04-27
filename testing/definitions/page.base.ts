import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture, tick} from '@angular/core/testing';

import {FAKE_HTTP_ASYNC_TIMEOUT} from '../stubs/http.service.stub';

import {MessageComponentDef} from './message.def';

import {INITIAL_LOAD_SELECTOR, NO_DATA_SELECTOR, UPDATE_FAILED_SELECTOR} from '../../app/common/message.component';

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

    public get initialLoadComponent(): MessageComponentDef {
        const element = this.debugElement.query(By.css(INITIAL_LOAD_SELECTOR));
        if (element) {
            return new MessageComponentDef(element);
        }
        return null;
    }

    public get noDataComponent(): MessageComponentDef {
        const element = this.debugElement.query(By.css(NO_DATA_SELECTOR));
        if (element) {
            return new MessageComponentDef(element);
        }
        return null;
    }

    public get updateFailedComponent(): MessageComponentDef {
        const element = this.debugElement.query(By.css(UPDATE_FAILED_SELECTOR));
        if (element) {
            return new MessageComponentDef(element);
        }
        return null;
    }
}