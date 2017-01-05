import {Component} from '@angular/core';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';

import {MarginShortfallSurplusService} from './margin.shortfall.surplus.service';
import {MarginShortfallSurplus} from './margin.types';

@Component({
    moduleId: module.id,
    selector: 'margin-shortfall-surplus-latest-summary',
    templateUrl: 'margin.shortfall.surplus.latest.summary.component.html',
    styleUrls: ['margin.shortfall.surplus.latest.summary.component.css']
})
export class MarginShortfallSurplusLatestSummaryComponent extends AbstractComponentWithAutoRefresh {

    public data: MarginShortfallSurplus;

    constructor(private marginService: MarginShortfallSurplusService) {
        super();
    }

    protected loadData(): void {
        this.marginService.getMarginShortfallSurplusData()
            .then((data: MarginShortfallSurplus) => {
                this.data = data;
            });
    }
}