import {NgModule} from '@angular/core';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdChipsModule,
    MdIconModule,
    MdInputModule,
    MdMenuModule,
    MdSelectModule,
    MdSidenavModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
    imports: [
        FlexLayoutModule,
        MdButtonModule,
        MdButtonToggleModule,
        MdCardModule,
        MdChipsModule,
        MdIconModule,
        MdInputModule,
        MdMenuModule,
        MdSelectModule,
        MdSidenavModule,
        MdTabsModule,
        MdToolbarModule,
        MdTooltipModule
    ],
    exports: [
        FlexLayoutModule,
        MdButtonModule,
        MdButtonToggleModule,
        MdCardModule,
        MdChipsModule,
        MdIconModule,
        MdInputModule,
        MdMenuModule,
        MdSelectModule,
        MdSidenavModule,
        MdTabsModule,
        MdToolbarModule,
        MdTooltipModule
    ]
})
class MaterialModulePrivate {
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