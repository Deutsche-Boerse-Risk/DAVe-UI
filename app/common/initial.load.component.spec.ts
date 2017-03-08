import {TestBed, async, fakeAsync} from "@angular/core/testing";

import {InitialLoadPage} from "../../testing";

import {InitialLoadComponent} from "./initial.load.component";

describe('InitialLoadComponent', () => {

    let page: InitialLoadPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InitialLoadComponent]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new InitialLoadPage(TestBed.createComponent(InitialLoadComponent));
        page.detectChanges();
    }));

    it('has correct text', fakeAsync(() => {
        expect(page.text).toContain('Loading ...');
    }));
});