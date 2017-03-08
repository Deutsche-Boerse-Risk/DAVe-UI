import {TestBed, async, ComponentFixtureAutoDetect, fakeAsync} from "@angular/core/testing";

import {UpdateFailedPage, UpdateFailedHostedPage, TestUpdateFailedHostComponent} from "../../testing";

import {UpdateFailedComponent} from "./update.failed.component";

describe('UpdateFailedComponent', () => {

    let page: UpdateFailedPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateFailedComponent],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new UpdateFailedPage(TestBed.createComponent(UpdateFailedComponent));
        page.detectChanges();
    }));

    it('has correct text', fakeAsync(() => {
        expect(page.text).toContain('Failed to update the data: .');
        page.component.error = 'custom error message';
        page.detectChanges();
        expect(page.text).toContain('Failed to update the data: ' + page.component.error + '.');
    }));
});

describe('UpdateFailedComponent hosted', () => {

    let page: UpdateFailedHostedPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateFailedComponent, TestUpdateFailedHostComponent],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new UpdateFailedHostedPage(TestBed.createComponent(TestUpdateFailedHostComponent));
        page.detectChanges();
    }));

    it('has correct text whenever hosted', fakeAsync(() => {
        // Test
        expect(page.text).toContain('Failed to update the data: custom error message.');
        page.component.errorMessage = 'new custom error message';
        page.detectChanges();
        expect(page.text).toContain('Failed to update the data: ' + page.component.errorMessage + '.');
    }));
});