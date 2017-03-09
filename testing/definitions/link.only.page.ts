import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {Page} from './page.base';
import {LinkDefinition} from './link.definition';
import {RouterLinkStubDirective} from '../stubs/router/router.link.stub';

export class LinkOnlyPage<T> extends Page<T> {

    constructor(fixture: ComponentFixture<T>) {
        super(fixture);
    }

    public get link(): LinkDefinition {
        return new LinkDefinition(this, this.debugElement.query(By.directive(RouterLinkStubDirective)));
    }
}