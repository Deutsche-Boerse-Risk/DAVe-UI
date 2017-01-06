import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {DATE_PIPE} from '../common/common.module';

import {ErrorResponse} from '../abstract.http.service';
import {MarginComponentsService} from './margin.components.service';
import {MarginComponentsRowData} from './margin.types';

import {AbstractHistoryListComponent} from '../abstract.history.list.component';

import {exportKeys, routingKeys} from './margin.components.latest.component';

const defaultOrdering = ['-received'];

@Component({
    moduleId: module.id,
    templateUrl: 'margin.components.history.component.html',
    styleUrls: ['margin.components.component.css']
})
export class MarginComponentsHistoryComponent extends AbstractHistoryListComponent<MarginComponentsRowData> {

    constructor(private marginComponentsService: MarginComponentsService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.marginComponentsService.getMarginComponentsHistory(this.routeParams['clearer'], this.routeParams['member'],
            this.routeParams['account'], this.routeParams['class'], this.routeParams['ccy'])
            .then((rows: MarginComponentsRowData[]) => {
                this.processData(rows);
            })
            .catch((err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    protected getTickFromRecord(record: MarginComponentsRowData): any {
        let tick = {
            period: DATE_PIPE.transform(record.received, 'yyyy-MM-dd HH:mm:ss'),
            variLiqui: record.variLiqui,
            premiumMargin: record.premiumMargin,
            spreadMargin: record.spreadMargin,
            additionalMargin: record.additionalMargin
        };
        return tick;
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
        return 'Margin Components History';
    }

    protected get rootRoutePath(): string {
        return '/marginComponentLatest';
    }

}
