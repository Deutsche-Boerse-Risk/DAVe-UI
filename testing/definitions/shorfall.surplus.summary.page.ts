import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {Page} from './page.base';

import {MarginShortfallSurplusLatestSummaryComponent} from '../../app/margin/margin.shortfall.surplus.latest.summary.component';

export class ShortfallSurplusSummaryPage extends Page<MarginShortfallSurplusLatestSummaryComponent> {

    constructor(fixture: ComponentFixture<MarginShortfallSurplusLatestSummaryComponent>) {
        super(fixture);
    }

    public get panels(): Panel[] {
        return this.debugElement.queryAll(By.css('.panel')).map((element: DebugElement) => {
            return new Panel(element);
        });
    }

}

export class Panel {

    constructor(private element: DebugElement) {
    }

    public get value(): string {
        return this.element.query(By.css('.huge')).nativeElement.textContent;
    }

    public get title(): string {
        return this.element.query(By.css('.text-right')).query(By.css('div:not(.huge)')).nativeElement.textContent;
    }

    public get green(): boolean {
        return this.element.nativeElement.classList.contains('panel-green');
    }

    public get red(): boolean {
        return this.element.nativeElement.classList.contains('panel-red');
    }
}