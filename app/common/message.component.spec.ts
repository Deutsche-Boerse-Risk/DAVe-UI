import {TestBed, async, fakeAsync} from '@angular/core/testing';

import {MaterialModule} from '../material/material.module';

import {MessagePage, MessageHostedPage, TestMessageHostComponent} from '../../testing';

import {MessageComponent} from './message.component';

describe('MessageComponent', () => {

    let page: MessagePage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports     : [MaterialModule],
            declarations: [MessageComponent]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new MessagePage(TestBed.createComponent(MessageComponent));
        page.detectChanges();
    }));

    it('has correct text', fakeAsync(() => {
        expect(page.message.text).toEqual('');
        page.component.message = 'custom error message';
        page.detectChanges();
        expect(page.message.text).toEqual(page.component.message + '.');
    }));
});

describe('MessageComponent hosted', () => {

    let page: MessageHostedPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports     : [MaterialModule],
            declarations: [MessageComponent, TestMessageHostComponent]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new MessageHostedPage(TestBed.createComponent(TestMessageHostComponent));
        page.detectChanges();
    }));

    it('has correct text whenever hosted', fakeAsync(() => {
        // Test
        expect(page.error.text).toEqual('custom message');
        expect(page.good.text).toEqual('custom message');
        expect(page.info.text).toEqual('custom message.');
        expect(page.message.text).toEqual('custom message');
        expect(page.warn.text).toEqual('custom message');
        expect(page.initialLoad.text).toEqual('Loading...');
        expect(page.noData.text).toEqual('No data available.');
        expect(page.updateFailed.text).toEqual('Failed to update the data: custom message.');
        page.component.message = 'new custom message';
        page.detectChanges();
        expect(page.error.text).toEqual(page.component.message);
        expect(page.good.text).toEqual(page.component.message);
        expect(page.info.text).toEqual(page.component.message);
        expect(page.message.text).toEqual(page.component.message);
        expect(page.warn.text).toEqual(page.component.message);
        expect(page.initialLoad.text).toEqual('Loading...');
        expect(page.noData.text).toEqual('No data available.');
        expect(page.updateFailed.text).toEqual('Failed to update the data: ' + page.component.message + '.');
    }));
});