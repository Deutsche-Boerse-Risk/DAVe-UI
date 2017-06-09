import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {COMPONENT_CSS, CSVExportColumn, ErrorResponse, OrderingCriteria, ValueGetter} from '@dbg-riskit/DAVe-common';

import {PoolMarginService} from './pool.margin.service';
import {PoolMarginData, PoolMarginParams} from './pool.margin.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';

export const routingKeys: (keyof PoolMarginParams)[] = ['clearer', 'pool', 'marginCurrency'];

@Component({
    moduleId   : module.id,
    templateUrl: 'pool.margin.latest.component.html',
    styleUrls  : ['../../' + COMPONENT_CSS]
})
export class PoolMarginLatestComponent extends AbstractLatestListComponent<PoolMarginData> {

    constructor(private poolMarginService: PoolMarginService,
        route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.poolMarginService.getPoolMarginLatest({
            clearer       : this.routeParams['clearer'],
            pool          : this.routeParams['pool'],
            marginCurrency: this.routeParams['marginCurrency']
        }).subscribe(
            (rows: PoolMarginData[]) => {
                this.processData(rows);
            },
            (err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    public get defaultOrdering(): (
        OrderingCriteria<PoolMarginData>
        | ValueGetter<PoolMarginData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): CSVExportColumn<PoolMarginData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Latest Pool Margin';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.POOL_MARGIN_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

export const valueGetters = {
    clearer              : (row: PoolMarginData) => row.clearer,
    pool                 : (row: PoolMarginData) => row.pool,
    marginCurrency       : (row: PoolMarginData) => row.marginCurrency,
    clrRptCurrency       : (row: PoolMarginData) => row.clrRptCurrency,
    requiredMargin       : (row: PoolMarginData) => row.requiredMargin,
    cashCollateralAmount : (row: PoolMarginData) => row.cashCollateralAmount,
    adjustedSecurities   : (row: PoolMarginData) => row.adjustedSecurities,
    adjustedGuarantee    : (row: PoolMarginData) => row.adjustedGuarantee,
    overUnderInMarginCurr: (row: PoolMarginData) => row.overUnderInMarginCurr,
    overUnderInClrRptCurr: (row: PoolMarginData) => row.overUnderInClrRptCurr,
    variPremInMarginCurr : (row: PoolMarginData) => row.variPremInMarginCurr,
    adjustedExchangeRate : (row: PoolMarginData) => row.adjustedExchangeRate,
    poolOwner            : (row: PoolMarginData) => row.poolOwner,
    received             : (row: PoolMarginData) => row.received
};

const defaultOrdering: (
    OrderingCriteria<PoolMarginData>
    | ValueGetter<PoolMarginData>)[] = [
    valueGetters.clearer,
    valueGetters.pool
];

export const exportKeys: CSVExportColumn<PoolMarginData>[] = [
    {
        get   : valueGetters.clearer,
        header: 'Clearer'
    },
    {
        get   : valueGetters.pool,
        header: 'Collateral Pool'
    },
    {
        get   : valueGetters.marginCurrency,
        header: 'Margin Currency'
    },
    {
        get   : (row: PoolMarginData) => row.businessDate,
        header: 'BizDt'
    },
    {
        get   : valueGetters.clrRptCurrency,
        header: 'clrRptCurrency'
    },
    {
        get   : valueGetters.requiredMargin,
        header: 'Required Margin'
    },
    {
        get   : valueGetters.cashCollateralAmount,
        header: 'Cash Collateral Amount'
    },
    {
        get   : valueGetters.adjustedSecurities,
        header: 'Adjusted Securities'
    },
    {
        get   : valueGetters.adjustedGuarantee,
        header: 'Adjusted Guarantee'
    },
    {
        get   : valueGetters.overUnderInMarginCurr,
        header: 'overUnderInMarginCurr'
    },
    {
        get   : valueGetters.overUnderInClrRptCurr,
        header: 'overUnderInClrRptCurr'
    },
    {
        get   : valueGetters.variPremInMarginCurr,
        header: 'variPremInMarginCurr'
    },
    {
        get   : valueGetters.adjustedExchangeRate,
        header: 'Adjusted Exchange Rate'
    },
    {
        get   : valueGetters.poolOwner,
        header: 'Pool Owner'
    },
    {
        get   : valueGetters.received,
        header: 'Last update'
    }
];

//</editor-fold>