import {Component} from '@angular/core';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';
import {ErrorResponse} from '../abstract.http.service';

import {MarginAccountService} from './margin.account.service';
import {MarginAccountDataBase, MarginAccountAggregationData} from './margin.types';

const defaultOrdering = ['-absAdditionalMargin', 'clearer', 'member', 'account'];

@Component({
    moduleId: module.id,
    selector: 'margin-account-aggregation',
    templateUrl: 'margin.account.aggregation.component.html',
    styleUrls: ['margin.account.aggregation.component.css']
})
export class MarginAccountAggregationComponent extends AbstractComponentWithAutoRefresh {

    public initialLoad: boolean = false;

    public errorMessage: string;

    public footer: MarginAccountDataBase;

    public data: MarginAccountDataBase[];

    constructor(private marginAccountService: MarginAccountService) {
        super();
    }

    public get defaultOrdering(): string[] {
        return defaultOrdering;
    }

    protected loadData(): void {
        this.marginAccountService.getMarginAccountAggregationData()
            .then((data: MarginAccountAggregationData) => {
                this.data = data.aggregatedRows;
                this.footer = data.summary;

                delete this.errorMessage;
                this.initialLoad = false;
            })
            .catch((err: ErrorResponse) => {
                delete this.data;
                delete this.footer;

                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }
}