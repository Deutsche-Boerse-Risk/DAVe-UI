import {TestBed, async, fakeAsync} from "@angular/core/testing";

import {NoDataPage} from "../../testing";

import {NoDataComponent} from "./no.data.component";

describe('NoDataComponent', () => {

    let page: NoDataPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NoDataComponent]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new NoDataPage(TestBed.createComponent(NoDataComponent));
        page.detectChanges();
    }));

    it('has correct text', fakeAsync(() => {
        expect(page.text).toContain('No data available.');
    }));
});