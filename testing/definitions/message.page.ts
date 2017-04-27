import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {Page} from './page.base';
import {MessageComponentDef} from './message.def';

import {
    ERROR_SELECTOR, GOOD_SELECTOR, INFO_SELECTOR, INITIAL_LOAD_SELECTOR, MESSAGE_SELECTOR, MessageComponent,
    NO_DATA_SELECTOR, UPDATE_FAILED_SELECTOR,
    WARN_SELECTOR
} from '../../app/common/message.component';

export class MessagePage extends Page<MessageComponent> {

    constructor(fixture: ComponentFixture<MessageComponent>) {
        super(fixture);
    }

    public get message(): MessageComponentDef {
        return new MessageComponentDef(this.debugElement);
    }
}

@Component({
    template: `
        <error [message]="message"></error>
        <good [message]="message"></good>
        <info [message]="message"></info>
        <message [message]="message"></message>
        <warn [message]="message"></warn>
        <initial-load [message]="message"></initial-load>
        <update-failed [message]="message"></update-failed>
        <no-data [message]="message"></no-data>
    `
})
export class TestMessageHostComponent {
    public message: string = 'custom message';
}

export class MessageHostedPage extends Page<TestMessageHostComponent> {

    constructor(fixture: ComponentFixture<TestMessageHostComponent>) {
        super(fixture);
    }

    public get error(): MessageComponentDef {
        return new MessageComponentDef(this.debugElement.query(By.css(ERROR_SELECTOR)));
    }

    public get good(): MessageComponentDef {
        return new MessageComponentDef(this.debugElement.query(By.css(GOOD_SELECTOR)));
    }

    public get info(): MessageComponentDef {
        return new MessageComponentDef(this.debugElement.query(By.css(INFO_SELECTOR)));
    }

    public get message(): MessageComponentDef {
        return new MessageComponentDef(this.debugElement.query(By.css(MESSAGE_SELECTOR)));
    }

    public get warn(): MessageComponentDef {
        return new MessageComponentDef(this.debugElement.query(By.css(WARN_SELECTOR)));
    }

    public get initialLoad(): MessageComponentDef {
        return new MessageComponentDef(this.debugElement.query(By.css(INITIAL_LOAD_SELECTOR)));
    }

    public get noData(): MessageComponentDef {
        return new MessageComponentDef(this.debugElement.query(By.css(NO_DATA_SELECTOR)));
    }

    public get updateFailed(): MessageComponentDef {
        return new MessageComponentDef(this.debugElement.query(By.css(UPDATE_FAILED_SELECTOR)));
    }
}
