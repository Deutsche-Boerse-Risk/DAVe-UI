import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {LinkOnlyPage} from './link.only.page';

import {LiquiGroupMarginTreemapComponent} from '../../app/liqui_group_margin/liqui.group.margin.treemap.component';

export class TreeMapPage extends LinkOnlyPage<LiquiGroupMarginTreemapComponent> {

    constructor(fixture: ComponentFixture<LiquiGroupMarginTreemapComponent>) {
        super(fixture);
    }

    public get initialLoadVisible(): boolean {
        return this.debugElement.query(By.css('initial-load')) !== null;
    }

    public get noDataVisible(): boolean {
        return this.debugElement.query(By.css('no-data')) !== null;
    }

    public get updateFailedVisible(): boolean {
        return this.debugElement.query(By.css('update-failed')) !== null;
    }

    public get googleChartVisible(): boolean {
        return this.debugElement.query(By.css('google-chart')) !== null;
    }
}