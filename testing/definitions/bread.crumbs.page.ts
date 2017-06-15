import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {MdChip} from '@angular/material';

import {ComponentFixture} from '@angular/core/testing';

import {click, Page} from '@dbg-riskit/dave-ui-testing';

import {RoutePart, BreadCrumbsComponent} from '../../app/list/bread.crumbs.component';

export class BreadCrumbsDefinition {

    private component: BreadCrumbsComponent;

    constructor(private page: Page<any>, public element: DebugElement) {
        this.component = element.componentInstance;
    }

    public get crumbs(): Crumb[] {
        return this.element.queryAll(By.directive(MdChip)).map((item: DebugElement) => new Crumb(this.page, item));
    }

    public get active(): DebugElement[] {
        return this.element.queryAll(By.directive(MdChip)).filter((item: DebugElement) => !item.attributes['disabled']);
    }

    public get inactive(): DebugElement[] {
        return this.element.queryAll(By.directive(MdChip)).filter((item: DebugElement) => item.attributes['disabled']);
    }
}

export class Crumb {

    constructor(private page: Page<any>, private item: DebugElement) {
    }

    public get text(): string {
        return this.item.nativeElement.textContent.trim();
    }

    public get active(): boolean {
        return this.item.attributes['disabled'] == null;
    }

    public get primary(): boolean {
        return this.item.classes['mat-chip-selected'];
    }

    public click() {
        click(this.item.nativeElement);
        this.page.advanceAndDetectChanges();
    }
}

export class BreadCrumbsPage extends Page<TestBreadCrumbsComponent> {

    constructor(fixture: ComponentFixture<TestBreadCrumbsComponent>) {
        super(fixture);
    }

    public get breadCrumbs(): BreadCrumbsDefinition {
        return new BreadCrumbsDefinition(this, this.debugElement.query(By.directive(BreadCrumbsComponent)));
    }
}

@Component({
    template: '<bread-crumbs [routeParts]="routeParts"></bread-crumbs>'
})
export class TestBreadCrumbsComponent {
    public routeParts: RoutePart[];
}