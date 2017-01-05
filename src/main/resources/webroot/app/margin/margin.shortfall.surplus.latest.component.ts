import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../abstract.http.service';
import {MarginShortfallSurplusService} from './margin.shortfall.surplus.service';
import {MarginShortfallSurplusData} from './margin.types';

import {AbstractListComponent} from '../abstract.list.component';

const routingKeys: string[] = ['clearer', 'pool', 'member', 'clearingCcy'];

const exportKeys: string[] = ['clearer', 'pool', 'poolType', 'member', 'clearingCcy', 'ccy', 'bizDt', 'marginRequirement',
    'securityCollateral', 'cashBalance', 'shortfallSurplus', 'marginCall', 'received'
];

const defaultOrdering = ['shortfallSurplus', 'clearer', 'pool', 'member', 'clearingCcy', 'ccy'];

@Component({
    moduleId: module.id,
    templateUrl: 'margin.shortfall.surplus.latest.component.html',
    styleUrls: ['margin.shortfall.surplus.latest.component.css']
})
export class MarginShortfallSurplusLatestComponent extends AbstractListComponent<MarginShortfallSurplusData> {

    constructor(private marginShortfallSurplusService: MarginShortfallSurplusService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.marginShortfallSurplusService.getShortfallSurplusLatest(this.routeParams['clearer'], this.routeParams['pool'],
            this.routeParams['member'], this.routeParams['clearingCcy'])
            .then((rows: MarginShortfallSurplusData[]) => {
                this.processData(rows);
            })
            .catch((err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    public get defaultOrdering(): string[] {
        return defaultOrdering;
    }

    protected get exportKeys(): string[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    protected get rootRouteTitle(): string {
        return 'Latest Margin Shortfall Surplus';
    }

    protected get rootRoutePath(): string {
        return '/marginShortfallSurplusLatest';
    }

}
