import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {MarginShortfallSurplusService} from './margin.shortfall.surplus.service';
import {MarginShortfallSurplusData} from './margin.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';

export const routingKeys: string[] = ['clearer', 'pool', 'member', 'clearingCcy'];

export const exportKeys: string[] = ['clearer', 'pool', 'poolType', 'member', 'clearingCcy', 'ccy', 'bizDt',
    'marginRequirement', 'securityCollateral', 'cashBalance', 'shortfallSurplus', 'marginCall', 'received'];

const defaultOrdering = ['shortfallSurplus', 'clearer', 'pool', 'member', 'clearingCcy', 'ccy'];

@Component({
    moduleId: module.id,
    templateUrl: 'margin.shortfall.surplus.latest.component.html',
    styleUrls: ['../common.component.css']
})
export class MarginShortfallSurplusLatestComponent extends AbstractLatestListComponent<MarginShortfallSurplusData> {

    constructor(private marginShortfallSurplusService: MarginShortfallSurplusService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.marginShortfallSurplusService.getShortfallSurplusLatest(this.routeParams['clearer'], this.routeParams['pool'],
            this.routeParams['member'], this.routeParams['clearingCcy'])
            .subscribe(
                (rows: MarginShortfallSurplusData[]) => {
                    this.processData(rows);
                },
                (err: ErrorResponse) => {
                    this.errorMessage = 'Server returned status ' + err.status;
                    this.initialLoad = false;
                });
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
        return 'Latest Margin Shortfall Surplus';
    }

    protected get rootRoutePath(): string {
        return '/marginShortfallSurplusLatest';
    }

}
