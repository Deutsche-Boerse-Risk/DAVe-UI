import {Component, DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

import {ComponentFixture} from "@angular/core/testing";

import {Page} from "./page.base";

import {HighlighterDirective} from "../../app/datatable/highlighter.directive";

@Component({
    template: `<div [highlighter]="trackBy" [context]="context"></div>`
})
export class HighLighterDirectiveTestComponent {

    public context: {row: any, storage?: any, index: number};

    public trackBy(index: number, row: any): any {
        return row;
    }
}

export class HighLighterDirectivePage extends Page<HighLighterDirectiveTestComponent> {

    constructor(fixture: ComponentFixture<HighLighterDirectiveTestComponent>) {
        super(fixture);
    }

    public get highlightedElement(): DebugElement {
        return this.debugElement.query(By.directive(HighlighterDirective));
    }

    public get classList(): DOMTokenList {
        return this.highlightedElement.nativeElement.classList;
    }

    public get highlighter(): HighlighterDirective {
        return this.highlightedElement.injector.get(HighlighterDirective);
    }
}