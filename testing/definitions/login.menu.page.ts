import {By} from '@angular/platform-browser';

import {Page} from './page.base';
import {LinkDefinition} from './link.definition';

import {RouterLinkStubDirective} from '../stubs/router/router.link.stub';

import {LoginMenuComponent} from '../../app/auth/login.menu.component';

export class LoginMenuPage extends Page<LoginMenuComponent> {

    public get loginLink(): LinkDefinition {
        return new LinkDefinition(this, this.debugElement.query(By.directive(RouterLinkStubDirective)));
    }

    public get logoutLink(): LinkDefinition {
        return new LinkDefinition(this, this.debugElement.query(By.css('.dropdown-menu a')));
    }
}