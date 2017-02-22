import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

import {ComponentFixture, TestBed, async} from "@angular/core/testing";

import {InitialLoadComponent} from "./initial.load.component";

describe('InitialLoadComponent', () => {

    let comp: InitialLoadComponent;
    let fixture: ComponentFixture<InitialLoadComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InitialLoadComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InitialLoadComponent);

        comp = fixture.componentInstance;

        // query for the title by CSS element selector
        de = fixture.debugElement.query(By.css('.alert'));
        el = de.nativeElement;
    });

    it('has correct text', () => {
        expect(el.textContent).toContain('Loading ...');
    });
});