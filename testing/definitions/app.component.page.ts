import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {LayoutComponent, LayoutComponentDefinition, LoginMenuComponentStub, Page} from '@dbg-riskit/dave-ui-testing';

import {AppComponent} from '../../app/app.component';
import {MenuComponent} from '../../app/menu/menu.component';

export class AppComponentPage extends Page<AppComponent> {

    public get layoutComponent(): LayoutComponentDefinition {
        return new LayoutComponentDefinition(this.debugElement.query(By.directive(LayoutComponent)), this);
    }

    public get appMenu(): DebugElement {
        return this.layoutComponent.headToolbar.query(By.directive(MenuComponent));
    }

    public get loginMenu(): DebugElement {
        return this.layoutComponent.headToolbar.query(By.directive(LoginMenuComponentStub));
    }

    public get outlet(): DebugElement {
        return this.layoutComponent.content.query(By.css('router-outlet'));
    }
}