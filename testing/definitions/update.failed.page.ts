import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {Page} from './page.base';

import {UpdateFailedComponent} from '../../app/common/update.failed.component';
import {Component} from '@angular/core';

export class UpdateFailedPage extends Page<UpdateFailedComponent> {

    constructor(fixture: ComponentFixture<UpdateFailedComponent>) {
        super(fixture);
    }

    public get text(): string {
        return this.debugElement.query(By.css('.alert')).nativeElement.textContent;
    }
}

@Component({
    template: '<update-failed [message]="errorMessage"></update-failed>'
})
export class TestUpdateFailedHostComponent {
    public errorMessage: string = 'custom error message';
}

export class UpdateFailedHostedPage extends Page<TestUpdateFailedHostComponent> {

    constructor(fixture: ComponentFixture<TestUpdateFailedHostComponent>) {
        super(fixture);
    }

    public get text(): string {
        return this.debugElement.query(By.css('.alert')).nativeElement.textContent;
    }
}
