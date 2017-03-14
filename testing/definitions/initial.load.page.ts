import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {Page} from './page.base';

import {InitialLoadComponent} from '../../app/common/initial.load.component';

export class InitialLoadPage extends Page<InitialLoadComponent> {

    constructor(fixture: ComponentFixture<InitialLoadComponent>) {
        super(fixture);
    }

    public get text(): string {
        return this.debugElement.query(By.css('.alert')).nativeElement.textContent;
    }
}