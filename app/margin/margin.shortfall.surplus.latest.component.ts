import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {MarginShortfallSurplusService} from './margin.shortfall.surplus.service';
import {MarginShortfallSurplusData} from './margin.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';

export const routingKeys: string[] = ['clearer', 'pool', 'member', 'clearingCcy'];

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

    public get defaultOrdering(): (OrderingCriteria<MarginShortfallSurplusData> | OrderingValueGetter<MarginShortfallSurplusData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): ExportColumn<MarginShortfallSurplusData>[] {
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

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

export const valueGetters = {
    clearer: (row: MarginShortfallSurplusData) => {
        return row.clearer
    },
    pool: (row: MarginShortfallSurplusData) => {
        return row.pool
    },
    poolType: (row: MarginShortfallSurplusData) => {
        return row.poolType
    },
    member: (row: MarginShortfallSurplusData) => {
        return row.member
    },
    clearingCcy: (row: MarginShortfallSurplusData) => {
        return row.clearingCcy
    },
    ccy: (row: MarginShortfallSurplusData) => {
        return row.ccy
    },
    shortfallSurplus: (row: MarginShortfallSurplusData) => {
        return row.shortfallSurplus
    },
    marginRequirement: (row: MarginShortfallSurplusData) => {
        return row.marginRequirement
    },
    securityCollateral: (row: MarginShortfallSurplusData) => {
        return row.securityCollateral
    },
    cashBalance: (row: MarginShortfallSurplusData) => {
        return row.cashBalance
    },
    marginCall: (row: MarginShortfallSurplusData) => {
        return row.marginCall
    },
    received: (row: MarginShortfallSurplusData) => {
        return row.received
    }
};

const defaultOrdering: (OrderingCriteria<MarginShortfallSurplusData> | OrderingValueGetter<MarginShortfallSurplusData>)[] = [
    valueGetters.shortfallSurplus,
    valueGetters.clearer,
    valueGetters.pool,
    valueGetters.member,
    valueGetters.clearingCcy,
    valueGetters.ccy
];

export const exportKeys: ExportColumn<MarginShortfallSurplusData>[] = [
    {
        get: valueGetters.clearer,
        header: 'Clearer'
    },
    {
        get: valueGetters.pool,
        header: 'Collateral Pool'
    },
    {
        get: valueGetters.poolType,
        header: 'Pool Type'
    },
    {
        get: valueGetters.member,
        header: 'Member / Client'
    },
    {
        get: valueGetters.clearingCcy,
        header: 'Clearing Ccy'
    },
    {
        get: valueGetters.ccy,
        header: 'Ccy'
    },
    {
        get: (row: MarginShortfallSurplusData) => {
            return row.bizDt
        },
        header: 'BizDt'
    },
    {
        get: valueGetters.shortfallSurplus,
        header: 'Shortfall / Surplus'
    },
    {
        get: valueGetters.marginRequirement,
        header: 'Margin Requirement'
    },
    {
        get: valueGetters.securityCollateral,
        header: 'Collateral'
    },
    {
        get: valueGetters.cashBalance,
        header: 'Cash Balance'
    },
    {
        get: valueGetters.marginCall,
        header: 'Margin Call'
    },
    {
        get: valueGetters.received,
        header: 'Last update'
    }
];

//</editor-fold>