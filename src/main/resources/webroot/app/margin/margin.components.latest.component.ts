import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../abstract.http.service';
import {MarginComponentsService} from './margin.components.service';
import {MarginComponentsRowData} from './margin.types';

import {AbstractLatestListComponent} from '../abstract.latest.list.component';

const routingKeys: string[] = ['clearer', 'member', 'account', 'class', 'ccy'];

const exportKeys: string[] = ['clearer', 'member', 'account', 'class', 'ccy', 'bizDt', 'variationMargin', 'premiumMargin',
    'liquiMargin', 'spreadMargin', 'additionalMargin', 'variLiqui', 'received'
];

const defaultOrdering = ['-absAdditionalMargin', 'clearer', 'member', 'account', 'class', 'ccy'];

@Component({
    moduleId: module.id,
    templateUrl: 'margin.components.latest.component.html',
    styleUrls: ['margin.components.latest.component.css']
})
export class MarginComponentsLatestComponent extends AbstractLatestListComponent<MarginComponentsRowData> {

    constructor(private marginComponentsService: MarginComponentsService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.marginComponentsService.getMarginComponentsLatest(this.routeParams['clearer'], this.routeParams['member'],
            this.routeParams['account'], this.routeParams['class'], this.routeParams['ccy'])
            .then((rows: MarginComponentsRowData[]) => {
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