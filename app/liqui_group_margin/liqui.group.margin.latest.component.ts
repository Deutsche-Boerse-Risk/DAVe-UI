import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {LiquiGroupMarginService} from './liqui.group.margin.service';
import {LiquiGroupMarginData, LiquiGroupMarginParams} from './liqui.group.margin.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';
import {LIQUI_GROUP_MARGIN_LATEST} from '../routes/routing.paths';

export const routingKeys: (keyof LiquiGroupMarginParams)[] = [
    'clearer',
    'member',
    'account',
    'marginClass',
    'marginCurrency'
];

@Component({
    moduleId   : module.id,
    templateUrl: 'liqui.group.margin.latest.component.html',
    styleUrls  : ['../common.component.css']
})
export class LiquiGroupMarginLatestComponent extends AbstractLatestListComponent<LiquiGroupMarginData> {

    constructor(private liquiGroupMarginService: LiquiGroupMarginService,
        route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.liquiGroupMarginService.getLiquiGroupMarginLatest({
            clearer       : this.routeParams['clearer'],
            member        : this.routeParams['member'],
            account       : this.routeParams['account'],
            marginClass   : this.routeParams['marginClass'],
            marginCurrency: this.routeParams['marginCurrency']
        }).subscribe(
            (rows: LiquiGroupMarginData[]) => {
                this.processData(rows);
            },
            (err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    public get defaultOrdering(): (
        OrderingCriteria<LiquiGroupMarginData>
        | OrderingValueGetter<LiquiGroupMarginData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): ExportColumn<LiquiGroupMarginData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Latest Liquidation Group Margin';
    }

    protected get rootRoutePath(): string {
        return '/' + LIQUI_GROUP_MARGIN_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

export const valueGetters = {
    clearer                    : (row: LiquiGroupMarginData) => row.clearer,
    member                     : (row: LiquiGroupMarginData) => row.member,
    account                    : (row: LiquiGroupMarginData) => row.account,
    marginClass                : (row: LiquiGroupMarginData) => row.marginClass,
    premiumMargin              : (row: LiquiGroupMarginData) => row.premiumMargin,
    currentLiquidatingMargin   : (row: LiquiGroupMarginData) => row.currentLiquidatingMargin,
    futuresSpreadMargin        : (row: LiquiGroupMarginData) => row.futuresSpreadMargin,
    additionalMargin           : (row: LiquiGroupMarginData) => row.additionalMargin,
    unadjustedMarginRequirement: (row: LiquiGroupMarginData) => row.unadjustedMarginRequirement,
    variationPremiumPayment    : (row: LiquiGroupMarginData) => row.variationPremiumPayment,
    received                   : (row: LiquiGroupMarginData) => row.received
};

const defaultOrdering: (OrderingCriteria<LiquiGroupMarginData> | OrderingValueGetter<LiquiGroupMarginData>)[] = [
    {
        get       : (row: LiquiGroupMarginData) => Math.abs(row.additionalMargin),
        descending: true
    },
    valueGetters.clearer,
    valueGetters.member,
    valueGetters.account,
    valueGetters.marginClass,
    (row: LiquiGroupMarginData) => row.marginCurrency
];

export const exportKeys: ExportColumn<LiquiGroupMarginData>[] = [
    {
        get   : valueGetters.clearer,
        header: 'Clearer'
    },
    {
        get   : valueGetters.member,
        header: 'Member / Client'
    },
    {
        get   : valueGetters.account,
        header: 'Account'
    },
    {
        get   : valueGetters.marginClass,
        header: 'Margin Class'
    },
    {
        get   : (row: LiquiGroupMarginData) => row.marginCurrency,
        header: 'Margin Currency'
    },
    {
        get   : (row: LiquiGroupMarginData) => row.businessDate,
        header: 'Business Date'
    },
    {
        get   : (row: LiquiGroupMarginData) => row.marginGroup,
        header: 'Margin Group'
    },
    {
        get   : valueGetters.premiumMargin,
        header: 'Premium Margin'
    },
    {
        get   : valueGetters.currentLiquidatingMargin,
        header: 'Current Liquidating Margin'
    },
    {
        get   : valueGetters.futuresSpreadMargin,
        header: 'Futures Spread Margin'
    },
    {
        get   : valueGetters.additionalMargin,
        header: 'Initial Margin'
    },
    {
        get   : valueGetters.unadjustedMarginRequirement,
        header: 'Unadjusted Margin'
    },
    {
        get   : valueGetters.variationPremiumPayment,
        header: 'Variation Premium Payment'
    },
    {
        get   : valueGetters.received,
        header: 'Last update'
    }
];

//</editor-fold>