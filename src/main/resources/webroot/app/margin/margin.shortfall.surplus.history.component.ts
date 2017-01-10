import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../abstract.http.service';
import {MarginShortfallSurplusService} from './margin.shortfall.surplus.service';
import {MarginShortfallSurplusData} from './margin.types';

import {AbstractHistoryListComponent, LineChartColumn} from '../abstract.history.list.component';

import {exportKeys, routingKeys} from './margin.shortfall.surplus.latest.component';

const defaultOrdering = ['-received'];

@Component({
    moduleId: module.id,
    templateUrl: 'margin.shortfall.surplus.history.component.html',
    styleUrls: ['../common.component.css']
})
export class MarginShortfallSurplusHistoryComponent extends AbstractHistoryListComponent<MarginShortfallSurplusData> {

    constructor(private marginShortfallSurplusService: MarginShortfallSurplusService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.marginShortfallSurplusService.getShortfallSurplusHistory(this.routeParams['clearer'], this.routeParams['pool'],
            this.routeParams['member'], this.routeParams['clearingCcy'], this.routeParams['ccy'])
            .then((rows: MarginShortfallSurplusData[]) => {
                this.processData(rows);
            })
            .catch((err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    protected getTickFromRecord(record: MarginShortfallSurplusData): LineChartColumn[] {
        return [
            {
                type: 'date',
                value: record.received
            },
            {
                label: 'Margin Requirement',
                type: 'number',
                value: record.marginRequirement,
            },
            {
                label: 'Security Collateral',
                type: 'number',
                value: record.securityCollateral,
            },
            {
                label: 'Cash Balance',
                type: 'number',
                value: record.cashBalance,
            },
            {
                label: 'Shortfall Surplus',
                type: 'number',
                value: record.shortfallSurplus,
            },
            {
                label: 'Margin Call',
                type: 'number',
                value: record.marginCall,
            }
        ];
    }

    public get defaultOrdering(): string[] {
        return defaultOrdering;
    }

    protected get exportKeys(): string[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys.concat(['ccy']);
    }

    protected get rootRouteTitle(): string {
        return 'Margin Shortfall Surplus History';
    }

    protected get rootRoutePath(): string {
        return '/marginShortfallSurplusLatest';
    }

}
