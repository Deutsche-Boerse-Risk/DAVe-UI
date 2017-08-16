import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {INITIAL_LOAD_SELECTOR, LinkOnlyPage, NO_DATA_SELECTOR} from '@dbg-riskit/dave-ui-testing';

import {LiquiGroupMarginTreemapComponent} from '../../app/liqui_group_margin/liqui.group.margin.treemap.component';

export class TreeMapPage extends LinkOnlyPage<LiquiGroupMarginTreemapComponent> {

    constructor(fixture: ComponentFixture<LiquiGroupMarginTreemapComponent>) {
        super(fixture);
    }

    public get initialLoadVisible(): boolean {
        return this.debugElement.query(By.css(INITIAL_LOAD_SELECTOR)) !== null;
    }

    public get noDataVisible(): boolean {
        return this.debugElement.query(By.css(NO_DATA_SELECTOR)) !== null;
    }

    public get googleChartVisible(): boolean {
        return this.debugElement.query(By.css('google-chart')) !== null;
    }
}