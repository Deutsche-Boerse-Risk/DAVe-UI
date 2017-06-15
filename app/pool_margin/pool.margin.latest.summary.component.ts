import {Component} from '@angular/core';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';

import {PoolMarginService} from './pool.margin.service';
import {PoolMarginSummaryData} from './pool.margin.types';
import {ErrorResponse} from '../http.service';

@Component({
    moduleId   : module.id,
    selector   : 'pool-margin-summary',
    templateUrl: 'pool.margin.latest.summary.component.html',
    styleUrls  : ['pool.margin.latest.summary.component.css']
})
export class PoolMarginLatestSummaryComponent extends AbstractComponentWithAutoRefresh {

    public data: PoolMarginSummaryData;

    constructor(private marginService: PoolMarginService) {
        super();
    }

    protected loadData(): void {
        this.marginService.getPoolMarginSummaryData()
            .subscribe((data: PoolMarginSummaryData) => {
                this.data = data;
            }, (error: ErrorResponse) => {
                console.error(error);
            });
    }
}