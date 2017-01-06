import {Component} from '@angular/core';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';
import {ErrorResponse} from '../abstract.http.service';

import {MarginComponentsService} from './margin.components.service';
import {MarginComponentsBaseData, MarginComponentsAggregationData} from './margin.types';

const defaultOrdering = ['-absAdditionalMargin', 'clearer', 'member', 'account'];

@Component({
    moduleId: module.id,
    selector: 'margin-components-aggregation',
    templateUrl: 'margin.components.aggregation.component.html',
    styleUrls: ['margin.components.aggregation.component.css']
})
export class MarginComponentsAggregationComponent extends AbstractComponentWithAutoRefresh {

    public initialLoad: boolean = false;

    public errorMessage: string;

    public footer: MarginComponentsBaseData;

    public data: MarginComponentsBaseData[];

    constructor(private marginComponentsService: MarginComponentsService) {
        super();
    }

    public get defaultOrdering(): string[] {
        return defaultOrdering;
    }

    protected loadData(): void {
        this.marginComponentsService.getMarginComponentsAggregationData()
            .then((data: MarginComponentsAggregationData) => {
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