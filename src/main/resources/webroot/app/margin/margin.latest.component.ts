import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../abstract.http.service';
import {MarginService} from './margin.service';
import {MarginAccountData} from './margin.types';

import {AbstractListComponent} from '../abstract.list.component';

const routingKeys: string[] = ['clearer', 'member', 'account', 'class', 'ccy'];

const exportKeys: string[] = ['clearer', 'member', 'account', 'class', 'ccy', 'bizDt', 'variationMargin', 'premiumMargin',
    'liquiMargin', 'spreadMargin', 'additionalMargin', 'variLiqui', 'received'
];

const defaultOrdering = ['-absAdditionalMargin', 'clearer', 'member', 'account', 'class', 'ccy'];

@Component({
    moduleId: module.id,
    templateUrl: 'margin.latest.component.html',
    styleUrls: ['margin.latest.component.css']
})
export class MarginLatestComponent extends AbstractListComponent<MarginAccountData> {

    constructor(private marginService: MarginService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.marginService.getMarginLatest(this.routeParams['clearer'], this.routeParams['member'],
            this.routeParams['account'], this.routeParams['class'], this.routeParams['ccy'])
            .then((rows: MarginAccountData[]) => {
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
        return 'Latest Margin Components';
    }

    protected get rootRoutePath(): string {
        return '/marginComponentLatest';
    }

}