import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {Page} from './page.base';

import {AppComponent} from '../../app/app.component';

export class AppComponentPage extends Page<AppComponent> {

    constructor(fixture: ComponentFixture<AppComponent>) {
        super(fixture);
    }

    public get navbar(): DebugElement {
        return this.debugElement.query(By.css('nav'));
    }

    public get appMenu(): DebugElement {
        return this.navbar.query(By.css('app-menu'));
    }

    public get loginMenu(): DebugElement {
        return this.navbar.query(By.css('login-menu'));
    }

    public get outlet(): DebugElement {
        return this.debugElement.query(By.css('router-outlet'));
    }
}