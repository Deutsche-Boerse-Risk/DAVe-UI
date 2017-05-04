import {async, TestBed, fakeAsync} from '@angular/core/testing';

import {HighLighterDirectivePage, HighLighterDirectiveTestComponent} from '../../testing';

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

    it('does nothing if context does not contain storage', fakeAsync(() => {
        page.component.context = {
            row  : {},
            index: 0
        };
        page.detectChanges();

        page.highlighter.ngOnInit();

        expect(page.classList).not.toContain(HIGHLIGHTER_CLASS);
    }));

    it('does nothing if storage contains the key', fakeAsync(() => {
        page.component.context = {
            row    : 'key',
            index  : 0,
            storage: {key: true}
        };
        page.detectChanges();

        page.highlighter.ngOnInit();

        expect(page.classList).not.toContain(HIGHLIGHTER_CLASS);
    }));

    it('adds class if no key is in storage and removes the class after timeout', fakeAsync(() => {
        page.component.context = {
            row    : 'key',
            index  : 0,
            storage: {}
        };
        page.detectChanges();

        page.highlighter.ngOnInit();

        expect(page.classList).toContain(HIGHLIGHTER_CLASS);

        page.advanceAndDetectChanges(HIGHLIGHTER_TIMEOUT);

        expect(page.classList).not.toContain(HIGHLIGHTER_CLASS);
    }));
});