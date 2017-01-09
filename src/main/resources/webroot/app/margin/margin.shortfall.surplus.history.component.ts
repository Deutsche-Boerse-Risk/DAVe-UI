import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {DATE_PIPE} from '../common/common.module';

import {ErrorResponse} from '../abstract.http.service';
import {MarginShortfallSurplusService} from './margin.shortfall.surplus.service';
import {MarginShortfallSurplusData} from './margin.types';

import {AbstractHistoryListComponent} from '../abstract.history.list.component';

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
            this.routeParams['member'], this.routeParams['clearingCcy'])
            .then((rows: MarginShortfallSurplusData[]) => {
                this.processData(rows);
            })
            .catch((err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    protected getTickFromRecord(record: MarginShortfallSurplusData): any {
        return {
            period: DATE_PIPE.transform(record.received, 'yyyy-MM-dd HH:mm:ss'),
            marginRequirement: record.marginRequirement,
            securityCollateral: record.securityCollateral,
            cashBalance: record.cashBalance,
            shortfallSurplus: record.shortfallSurplus,
            marginCall: record.marginCall
        };
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
        return 'Margin Shortfall Surplus History';
    }

    protected get rootRoutePath(): string {
        return '/marginShortfallSurplusLatest';
    }

}
