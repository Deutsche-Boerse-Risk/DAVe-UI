import {NgModule} from '@angular/core';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialModule as MM} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
    imports: [
        MM
    ],
    exports: [
        FlexLayoutModule,
        MM
    ]
})
export class MaterialModulePrivate {
}

@NgModule({
    imports: [
        BrowserAnimationsModule,
        MaterialModulePrivate
    ],
    exports: [MaterialModulePrivate]
})
export class MaterialModule {
}

@NgModule({
    imports: [
        NoopAnimationsModule,
        MaterialModulePrivate
    ],
    exports: [MaterialModulePrivate]
})
export class NoopAnimationsMaterialModule {
}