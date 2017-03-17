import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {LinkOnlyPage} from './link.only.page';

import {MarginComponentsTreemapComponent} from '../../app/margin/margin.components.treemap.component';

export class TreeMapPage extends LinkOnlyPage<MarginComponentsTreemapComponent> {

    constructor(fixture: ComponentFixture<MarginComponentsTreemapComponent>) {
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