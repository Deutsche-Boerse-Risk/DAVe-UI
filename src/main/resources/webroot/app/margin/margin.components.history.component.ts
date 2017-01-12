import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {MarginComponentsService} from './margin.components.service';
import {MarginComponentsRowData} from './margin.types';

import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';

import {exportKeys, routingKeys} from './margin.components.latest.component';

const defaultOrdering = ['-received'];

@Component({
    moduleId: module.id,
    templateUrl: 'margin.components.history.component.html',
    styleUrls: ['../common.component.css']
})
export class MarginComponentsHistoryComponent extends AbstractHistoryListComponent<MarginComponentsRowData> {

    constructor(private marginComponentsService: MarginComponentsService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.marginComponentsService.getMarginComponentsHistory(this.routeParams['clearer'], this.routeParams['member'],
            this.routeParams['account'], this.routeParams['class'], this.routeParams['ccy'])
            .subscribe(
                (rows: MarginComponentsRowData[]) => {
                    this.processData(rows);
                }, (err: ErrorResponse) => {
                    this.errorMessage = 'Server returned status ' + err.status;
                    this.initialLoad = false;
                });
    }

    protected getTickFromRecord(record: MarginComponentsRowData): LineChartColumn[] {
        return [
            {
                type: 'date',
                value: record.received
            },
            {
                label: 'Variation / Liquidation Marign',
                type: 'number',
                value: record.variLiqui,
            },
            {
                label: 'Premium Margin',
                type: 'number',
                value: record.premiumMargin,
            },
            {
                label: 'Spread Margin',
                type: 'number',
                value: record.spreadMargin,
            },
            {
                label: 'Additional Margin',
                type: 'number',
                value: record.additionalMargin,
            }
        ];
    }

    public get defaultOrdering(): string[] {
        return defaultOrdering;
    }

    public get exportKeys(): string[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Margin Components History';
    }

    protected get rootRoutePath(): string {
        return '/marginComponentLatest';
    }

}
