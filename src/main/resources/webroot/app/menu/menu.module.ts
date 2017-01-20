import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {MenuComponent} from './menu.component';
import {RouterLinkActiveDirective} from './router.link.active.directive';
import {RouterSubLinkDirective} from './router.sub.link.directive';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule
    ],
    declarations: [
        MenuComponent,
        RouterLinkActiveDirective, // Allows us to highlight also sub routes like "history" tabs.
        RouterSubLinkDirective
    ],
    exports: [MenuComponent]
})
export class MenuModule {
}