import {async, TestBed, fakeAsync} from '@angular/core/testing';

import {HighLighterDirectivePage, HighLighterDirectiveTestComponent} from '../../testing';

import {Row} from './data.table.component';
import {HighlighterDirective, HIGHLIGHTER_TIMEOUT, HIGHLIGHTER_CLASS} from './highlighter.directive';

describe('Highlighter directive', () => {
    let page: HighLighterDirectivePage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HighLighterDirectiveTestComponent, HighlighterDirective]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new HighLighterDirectivePage(TestBed.createComponent(HighLighterDirectiveTestComponent));
        page.detectChanges();
    }));

    it('does nothing if context is not provided', fakeAsync(() => {
        expect(page.classList).not.toContain(HIGHLIGHTER_CLASS);
    }));

    it('does nothing if context is disabled', fakeAsync(() => {
        page.component.context = {
            row    : new Row('key'),
            index  : 0,
            storage: {},
            enabled: false
        };
        page.detectChanges();

        page.highlighter.ngOnInit();

        expect(page.classList).not.toContain(HIGHLIGHTER_CLASS);
    }));

    it('does nothing if context does not contain storage', fakeAsync(() => {
        page.component.context = {
            row    : new Row({}),
            index  : 0,
            enabled: true
        };
        page.detectChanges();

        page.highlighter.ngOnInit();

        expect(page.classList).not.toContain(HIGHLIGHTER_CLASS);
    }));

    it('does nothing if storage contains the key', fakeAsync(() => {
        page.component.context = {
            row    : new Row('key'),
            index  : 0,
            storage: {key: true},
            enabled: true
        };
        page.detectChanges();

        page.highlighter.ngOnInit();

        expect(page.classList).not.toContain(HIGHLIGHTER_CLASS);
    }));

    it('adds class if no key is in storage and removes the class after timeout', fakeAsync(() => {
        page.component.context = {
            row    : new Row('key'),
            index  : 0,
            storage: {},
            enabled: true
        };
        page.detectChanges();

        page.highlighter.ngOnInit();

        expect(page.classList).toContain(HIGHLIGHTER_CLASS);

        page.advanceAndDetectChanges(HIGHLIGHTER_TIMEOUT);

        expect(page.classList).not.toContain(HIGHLIGHTER_CLASS);
    }));
});