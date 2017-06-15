import {DebugElement, DebugNode} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {click, Page} from '@dbg-riskit/DAVe-UI-testing';

import {DashboardComponent} from '../../app/dashboard/dashboard.component';

export class DashboardPage extends Page<DashboardComponent> {

    constructor(fixture: ComponentFixture<DashboardComponent>) {
        super(fixture);
    }

    public get tabs(): Tab[] {
        return this.debugElement.queryAll(By.css('a.mat-tab-link'))
            .map((el: DebugElement) => new Tab(el, this));
    }

    public get contentPane(): DebugElement {
        return this.debugElement.query(By.css('.mat-tab-body'));
    }

    public get activeTab(): Tab {
        return new Tab(this.debugElement.query(By.css('a.mat-tab-link[ng-reflect-active="true"]')), this);
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
        let textNodes: string[] = this.handle.childNodes.filter((childNode: DebugNode) => {
            return childNode.nativeNode.nodeType === Node.TEXT_NODE;
        }).map((textNode: DebugNode) => textNode.nativeNode.textContent.trim());
        return textNodes.join(' ').trim();
    }

    public click(): void {
        click(this.handle);
        this.page.detectChanges();
    }
}