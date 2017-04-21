import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
        BrowserAnimationsModule,
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
export class MaterialModule {
}