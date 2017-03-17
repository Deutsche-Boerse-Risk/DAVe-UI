import {DebugElement} from '@angular/core';

import {Page} from './page.base';
import {RouterLinkStubDirective} from '../stubs/router/router.link.stub';
import {click} from '../events';

export class LinkDefinition {

    constructor(private page: Page<any>, public link: DebugElement) {
    }

    public get stub(): RouterLinkStubDirective {
        return this.link.injector.get(RouterLinkStubDirective);
    }

    public get text(): string {
        return this.link.nativeElement.textContent.trim();
    }

    public click() {
        click(this.link.nativeElement);
        this.page.advance();
    }
}