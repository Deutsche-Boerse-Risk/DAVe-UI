import {Component, DebugElement} from "@angular/core";
import {async, TestBed, ComponentFixtureAutoDetect, ComponentFixture, fakeAsync, tick} from "@angular/core/testing";
import {HighlighterDirective} from "./highlighter.directive";
import {By} from "@angular/platform-browser";

@Component({
    template: `<div [highlighter]="trackBy" [context]="context"></div>`
})
class DirectiveTestComponent {

    public context: {row: any, storage?: any, index: number};

    public trackBy(index: number, row: any): any {
        return row;
    }
}

describe('Highlighter directive', () => {
    let hostFixture: ComponentFixture<DirectiveTestComponent>;
    let debugElement: DebugElement;
    let hostComponent: DirectiveTestComponent;
    let highlighter: HighlighterDirective;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DirectiveTestComponent, HighlighterDirective],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        hostFixture = TestBed.createComponent(DirectiveTestComponent);
        hostComponent = hostFixture.componentInstance;
        debugElement = hostFixture.debugElement.query(By.directive(HighlighterDirective));
        highlighter = debugElement.injector.get(HighlighterDirective);
    }));

    it('does nothing if context is not provided', () => {
        expect(debugElement.nativeElement.classList).not.toContain('bg-warning');
    });

    it('does nothing if context does not contain storage', () => {
        hostComponent.context = {row: {}, index: 0};
        hostFixture.detectChanges();

        highlighter.ngOnInit();

        expect(debugElement.nativeElement.classList).not.toContain('bg-warning');
    });

    it('does nothing if storage contains the key', () => {
        hostComponent.context = {row: 'key', index: 0, storage: {key: true}};
        hostFixture.detectChanges();

        highlighter.ngOnInit();

        expect(debugElement.nativeElement.classList).not.toContain('bg-warning');
    });

    it('adds class if no key is in storage and removes the class after timeout', fakeAsync(() => {
        hostComponent.context = {row: 'key', index: 0, storage: {}};
        hostFixture.detectChanges();

        highlighter.ngOnInit();

        expect(debugElement.nativeElement.classList).toContain('bg-warning');

        tick(15000);

        expect(debugElement.nativeElement.classList).not.toContain('bg-warning');
    }));
});