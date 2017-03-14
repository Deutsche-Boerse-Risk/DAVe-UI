import {Component, DebugElement, DebugNode} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {Page} from './page.base';

import {RoutePart, BreadCrumbsComponent} from '../../app/list/bread.crumbs.component';
import {LinkDefinition} from './link.definition';

export class BreadCrumbsDefinition {

    private component: BreadCrumbsComponent;

    constructor(private page: Page<any>, public element: DebugElement) {
        this.component = element.componentInstance;
    }

    public get crumbs(): Crumb[] {
        let nodes = this.element.childNodes.filter((node: DebugNode) => {
            return node.nativeNode.nodeType === Node.TEXT_NODE && node.nativeNode.textContent.trim()
                || (node as DebugElement).name;
        }).map((node: DebugNode) => {
            if (node.nativeNode.wholeText) {
                return node.nativeNode.wholeText.trim();
            }
            return node;
        });

        let crumbs: Crumb[] = [];
        for (let i = 0; i < nodes.length; i += 2) {
            crumbs.push(new Crumb(this.page, nodes[i] as DebugElement, nodes[i + 1] as string));
        }

        return crumbs;
    }

    public get active(): DebugElement[] {
        return this.element.queryAll(By.css('a'));
    }

    public get inactive(): DebugElement[] {
        return this.element.queryAll(By.css('span'));
    }
}

export class Crumb {

    constructor(private page: Page<any>, private item: DebugElement, public separatorAfter: string) {
    }

    public get text(): string {
        return this.item.nativeElement.textContent.trim();
    }

    public get active(): boolean {
        return this.item.name === 'a';
    }

    public get link(): LinkDefinition {
        return new LinkDefinition(this.page, this.item);
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