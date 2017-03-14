import {Component} from '@angular/core';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';

import {MarginShortfallSurplusService} from './margin.shortfall.surplus.service';
import {MarginShortfallSurplusBase} from './margin.types';
import {ErrorResponse} from '../http.service';

@Component({
    moduleId: module.id,
    selector: 'margin-shortfall-surplus-summary',
    templateUrl: 'margin.shortfall.surplus.latest.summary.component.html',
    styleUrls: ['margin.shortfall.surplus.latest.summary.component.css']
})
export class MarginShortfallSurplusLatestSummaryComponent extends AbstractComponentWithAutoRefresh {

    public data: MarginShortfallSurplusBase;

    constructor(private marginService: MarginShortfallSurplusService) {
        super();
    }

    protected loadData(): void {
        this.marginService.getMarginShortfallSurplusData()
            .subscribe((data: MarginShortfallSurplusBase) => {
                this.data = data;
            }, (error: ErrorResponse) => {
                console.error(error);
            });
    }
}