import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {Page} from './page.base';
import {click} from '../events';
import {RouterLinkStubDirective} from '../stubs/router/router.link.stub';

import {LoginMenuComponent} from '../../app/auth/login.menu.component';

export class LoginMenuPage extends Page<LoginMenuComponent> {

    constructor(fixture: ComponentFixture<LoginMenuComponent>) {
        super(fixture);
    }

    public get link(): DebugElement {
        return this.debugElement.query(By.directive(RouterLinkStubDirective));
    }

    public get linkStub(): RouterLinkStubDirective {
        return this.link.injector.get(RouterLinkStubDirective);
    }

    public get linkText(): string {
        return this.link.nativeElement.textContent;
    }

    public clickLink() {
        click(this.link.nativeElement);
        this.advance();
    }
}