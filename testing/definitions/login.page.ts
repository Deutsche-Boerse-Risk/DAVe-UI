import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture, tick} from '@angular/core/testing';

import {click, setNgModelValue} from '../events';
import {Page} from './page.base';

import {LoginComponent} from '../../app/auth/login.component';

export class LoginPage extends Page<LoginComponent> {

    constructor(fixture: ComponentFixture<LoginComponent>) {
        super(fixture);
    }

    public get formElement(): DebugElement {
        return this.debugElement.query(By.css('form'));
    }

    public get usernameElement(): DebugElement {
        return this.formElement.query(By.css('input[name=username]'));
    }

    public set username(username: string) {
        setNgModelValue(this.usernameElement, username);
    }

    public get passwordElement(): DebugElement {
        return this.formElement.query(By.css('input[name=password]'));
    }

    public set password(password: string) {
        setNgModelValue(this.passwordElement, password);
    }

    public get loginButtonElement(): DebugElement {
        return this.formElement.query(By.css('.btn-primary'));
    }

    public get alertSucessElement(): DebugElement {
        return this.debugElement.query(By.css('.alert.alert-success'));
    }

    public get alertSucessMessage(): string {
        return this.alertSucessElement.nativeElement.textContent;
    }

    public get errorMessageElement(): DebugElement {
        return this.debugElement.query(By.css('.alert.alert-danger'));
    }

    public get errorMessage(): string {
        return this.errorMessageElement.nativeElement.textContent;
    }

    public clickLogin() {
        click(this.loginButtonElement.nativeElement);
        tick();
        this.detectChanges();
    }
}