import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";

import {MenuComponent} from "./menu.component";

@NgModule({
    imports: [
        BrowserModule,
        RouterModule
    ],
    declarations: [MenuComponent],
    exports: [MenuComponent]
})
export class MenuModule {
}