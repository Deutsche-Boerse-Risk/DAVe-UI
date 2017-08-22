import {Component} from '@angular/core';

import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-devkit';

import {AbstractComponent} from '../abstract.component';

import {PoolMarginService} from './pool.margin.service';
import {PoolMarginSummaryData} from './pool.margin.types';

import {Subscription} from 'rxjs/Subscription';

@Component({
    moduleId   : module.id,
    selector   : 'pool-margin-summary',
    templateUrl: 'pool.margin.latest.summary.component.html',
    styleUrls  : [
        '../../' + COMPONENT_CSS,
        'pool.margin.latest.summary.component.css'
    ]
})
export class PoolMarginLatestSummaryComponent extends AbstractComponent {

    public pools: PoolMarginSummaryData[];

    constructor(private marginService: PoolMarginService) {
        super();
    }

    protected loadData(): Subscription {
        return this.marginService.getPoolMarginSummaryData()
            .subscribe((data: PoolMarginSummaryData[]) => {
                this.pools = data;
            });
    }
}