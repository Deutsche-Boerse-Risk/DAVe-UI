import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';


import {INITIAL_LOAD_SELECTOR, NO_DATA_SELECTOR, UPDATE_FAILED_SELECTOR} from '../../app/common/message.component';

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

    public get updateFailedVisible(): boolean {
        return this.debugElement.query(By.css(UPDATE_FAILED_SELECTOR)) !== null;
    }

    public get googleChartVisible(): boolean {
        return this.debugElement.query(By.css('google-chart')) !== null;
    }
}