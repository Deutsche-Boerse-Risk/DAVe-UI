import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

import {ComponentFixture, TestBed, async} from "@angular/core/testing";

import {NoDataComponent} from "./no.data.component";

describe('NoDataComponent', () => {

    let comp: NoDataComponent;
    let fixture: ComponentFixture<NoDataComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NoDataComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NoDataComponent);

        comp = fixture.componentInstance;

        // query for the title by CSS element selector
        de = fixture.debugElement.query(By.css('.alert'));
        el = de.nativeElement;
    });

    it('has correct text', () => {
        expect(el.textContent).toContain('No data available.');
    });
});