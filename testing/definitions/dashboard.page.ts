import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {click} from '../events';
import {Page} from './page.base';

import {DashboardComponent} from '../../app/dashboard/dashboard.component';

export class DashboardPage extends Page<DashboardComponent> {

    constructor(fixture: ComponentFixture<DashboardComponent>) {
        super(fixture);
    }

    public get tabs(): Tab[] {
        return this.debugElement.queryAll(By.css('a[data-toggle="tab"]'))
            .map((el: DebugElement) => new Tab(el, this));
    }

    public get contentPane(): DebugElement {
        return this.debugElement.query(By.css('.tab-pane'));
    }

    public get activeTab(): Tab {
        return new Tab(this.debugElement.query(By.css('.nav-tabs [data-target="#'
            + this.contentPane.attributes.id + '"]')), this);
    }

    public contains(selector: string): boolean {
        return this.contentPane.query(By.css(selector)) !== null;
    }
}

export class Tab {

    constructor(public handle: DebugElement,
        private page: { detectChanges: () => void }) {
    }

    public get label(): string {
        return this.handle.nativeElement.textContent.trim();
    }

    public click(): void {
        click(this.handle);
        this.page.detectChanges();
    }
}