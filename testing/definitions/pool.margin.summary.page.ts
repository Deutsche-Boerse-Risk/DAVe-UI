import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {MdCard} from '@angular/material';

import {ComponentFixture} from '@angular/core/testing';

import {LinkDefinition, Page, RouterLinkStubDirective} from '@dbg-riskit/dave-ui-testing';

import {PoolMarginLatestSummaryComponent} from '../../app/pool_margin/pool.margin.latest.summary.component';

export class PoolMarginSummaryPage extends Page<PoolMarginLatestSummaryComponent> {

    constructor(fixture: ComponentFixture<PoolMarginLatestSummaryComponent>) {
        super(fixture);
    }

    public get pools(): Pool[] {
        return this.debugElement.queryAll(By.css('.pool')).map((element: DebugElement) => {
            return new Pool(element, this);
        });
    }
}

export class Pool {

    constructor(private element: DebugElement, private page: Page<any>) {
    }

    public get panels(): Panel[] {
        return this.element.queryAll(By.directive(MdCard)).map((element: DebugElement) => {
            return new Panel(element, this.page);
        });
    }
}

export class Panel {

    constructor(private element: DebugElement, private page: Page<any>) {
    }

    public get value(): string {
        let valueElement = this.element.query(By.css('.huge'));
        if (!valueElement) {
            return null;
        }
        return valueElement.nativeElement.textContent;
    }

    public get title(): string {
        return this.element.query(By.css('div:not(.huge)')).nativeElement.textContent;
    }

    public get link(): LinkDefinition {
        let linkElement = this.element.query(By.directive(RouterLinkStubDirective));
        if (!linkElement) {
            return null;
        }
        return new LinkDefinition(this.page, linkElement);
    }

    public get green(): boolean {
        return this.element.nativeElement.classList.contains('good');
    }

    public get red(): boolean {
        return this.element.nativeElement.classList.contains('error');
    }
}