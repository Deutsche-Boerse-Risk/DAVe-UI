import {Component} from '@angular/core';

import {COMPONENT_CSS, ErrorResponse} from '@dbg-riskit/DAVe-common';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';

import {PoolMarginService} from './pool.margin.service';
import {PoolMarginSummaryData} from './pool.margin.types';

@Component({
    moduleId   : module.id,
    selector   : 'pool-margin-summary',
    templateUrl: 'pool.margin.latest.summary.component.html',
    styleUrls  : [
        '../../' + COMPONENT_CSS,
        'pool.margin.latest.summary.component.css'
    ]
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