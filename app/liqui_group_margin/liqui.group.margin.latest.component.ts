import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {COMPONENT_CSS, ValueGetter} from '@dbg-riskit/dave-ui-common';
import {OrderingCriteria} from '@dbg-riskit/dave-ui-datatable';
import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {LiquiGroupMarginService} from './liqui.group.margin.service';
import {LiquiGroupMarginData, LiquiGroupMarginParams} from './liqui.group.margin.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';

import {Subscription} from 'rxjs/Subscription';

export const routingKeys: (keyof LiquiGroupMarginParams)[] = [
    'clearer',
    'member',
    'account',
    'marginClass'
];

@Component({
    moduleId   : module.id,
    templateUrl: 'liqui.group.margin.latest.component.html',
    styleUrls  : ['../../' + COMPONENT_CSS]
})
export class LiquiGroupMarginLatestComponent extends AbstractLatestListComponent<LiquiGroupMarginData> {

    constructor(private liquiGroupMarginService: LiquiGroupMarginService, route: ActivatedRoute,
        dateFormatter: DateFormatter, numberFormatter: DecimalPipe) {
        super(route, dateFormatter, numberFormatter);
    }

    protected loadData(): Subscription {
        return this.liquiGroupMarginService.getLiquiGroupMarginLatest({
            clearer    : this.routeParams['clearer'],
            member     : this.routeParams['member'],
            account    : this.routeParams['account'],
            marginClass: this.routeParams['marginClass']
        }).subscribe(
            (rows: LiquiGroupMarginData[]) => {
                this.processData(rows);
            });
    }

    public get defaultOrdering(): (
        OrderingCriteria<LiquiGroupMarginData>
        | ValueGetter<LiquiGroupMarginData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): CSVExportColumn<LiquiGroupMarginData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Latest Liquidation Group Margin';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.LIQUI_GROUP_MARGIN_LATEST;
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
    additionalMargin           : (row: LiquiGroupMarginData) => row.additionalMargin,
    unadjustedMarginRequirement: (row: LiquiGroupMarginData) => row.unadjustedMarginRequirement,
    variationPremiumPayment    : (row: LiquiGroupMarginData) => row.variationPremiumPayment,
    received                   : (row: LiquiGroupMarginData) => row.received
};

const defaultOrdering: (OrderingCriteria<LiquiGroupMarginData> | ValueGetter<LiquiGroupMarginData>)[] = [
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

export const exportKeys: CSVExportColumn<LiquiGroupMarginData>[] = [
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
        get   : (row: LiquiGroupMarginData) => row.futuresSpreadMargin,
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