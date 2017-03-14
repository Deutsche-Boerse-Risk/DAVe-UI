import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {Page} from './page.base';

import {NoDataComponent} from '../../app/common/no.data.component';

export class NoDataPage extends Page<NoDataComponent> {

    constructor(fixture: ComponentFixture<NoDataComponent>) {
        super(fixture);
    }

    public get text(): string {
        return this.debugElement.query(By.css('.alert')).nativeElement.textContent;
    }
}