import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {Page} from './page.base';

import {Row} from '../../app/datatable/data.table.component';
import {HighlighterDirective} from '../../app/datatable/highlighter.directive';

@Component({
    template: `
        <div [highlighter]="trackBy" [highlighterContext]="context"></div>`
})
export class HighLighterDirectiveTestComponent {

    public context: { row: any, storage?: any, index: number, enabled: boolean };

    public trackBy(index: number, row: Row<any>): any {
        return row.rowData;
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