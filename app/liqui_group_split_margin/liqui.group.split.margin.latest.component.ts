import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {LiquiGroupSplitMarginService} from './liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData, LiquiGroupSplitMarginParams} from './liqui.group.split.margin.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';
import {LIQUI_GROUP_MARGIN_LATEST} from '../routes/routing.paths';

export const routingKeys: (keyof LiquiGroupSplitMarginParams)[] = [
    'clearer',
    'member',
    'account',
    'liquidationGroup',
    'liquidationGroupSplit',
    'marginCurrency'
];

@Component({
    moduleId   : module.id,
    templateUrl: 'liqui.group.split.margin.latest.component.html',
    styleUrls  : ['../common.component.css']
})
export class LiquiGroupSplitMarginLatestComponent extends AbstractLatestListComponent<LiquiGroupSplitMarginData> {

    constructor(private liquiGroupSplitMarginService: LiquiGroupSplitMarginService,
        route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.liquiGroupSplitMarginService.getLiquiGroupSplitMarginLatest({
            clearer              : this.routeParams['clearer'],
            member               : this.routeParams['member'],
            account              : this.routeParams['account'],
            liquidationGroup     : this.routeParams['liquidationGroup'],
            liquidationGroupSplit: this.routeParams['liquidationGroupSplit'],
            marginCurrency       : this.routeParams['marginCurrency']
        }).subscribe(
            (rows: LiquiGroupSplitMarginData[]) => {
                this.processData(rows);
            },
            (err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    public get defaultOrdering(): (
        OrderingCriteria<LiquiGroupSplitMarginData>
        | OrderingValueGetter<LiquiGroupSplitMarginData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): ExportColumn<LiquiGroupSplitMarginData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Latest Liquidation Group Split Margin';
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
    clearer                : (row: LiquiGroupSplitMarginData) => row.clearer,
    member                 : (row: LiquiGroupSplitMarginData) => row.member,
    account                : (row: LiquiGroupSplitMarginData) => row.account,
    liquidationGroup       : (row: LiquiGroupSplitMarginData) => row.liquidationGroup,
    liquidationGroupSplit  : (row: LiquiGroupSplitMarginData) => row.liquidationGroupSplit,
    marginCurrency         : (row: LiquiGroupSplitMarginData) => row.marginCurrency,
    premiumMargin          : (row: LiquiGroupSplitMarginData) => row.premiumMargin,
    marketRisk             : (row: LiquiGroupSplitMarginData) => row.marketRisk,
    liquRisk               : (row: LiquiGroupSplitMarginData) => row.liquRisk,
    longOptionCredit       : (row: LiquiGroupSplitMarginData) => row.longOptionCredit,
    variationPremiumPayment: (row: LiquiGroupSplitMarginData) => row.variationPremiumPayment,
    received               : (row: LiquiGroupSplitMarginData) => row.received
};

const defaultOrdering: (
    OrderingCriteria<LiquiGroupSplitMarginData>
    | OrderingValueGetter<LiquiGroupSplitMarginData>)[] = [
    valueGetters.clearer,
    valueGetters.member,
    valueGetters.account,
    valueGetters.liquidationGroup,
    valueGetters.liquidationGroupSplit,
    valueGetters.marginCurrency
];

export const exportKeys: ExportColumn<LiquiGroupSplitMarginData>[] = [
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
        get   : valueGetters.liquidationGroup,
        header: 'Liquidation Group'
    },
    {
        get   : valueGetters.liquidationGroupSplit,
        header: 'Liquidation Group Split'
    },
    {
        get   : valueGetters.marginCurrency,
        header: 'Margin Currency'
    },
    {
        get   : (row: LiquiGroupSplitMarginData) => row.businessDate,
        header: 'Business Date'
    },
    {
        get   : valueGetters.premiumMargin,
        header: 'Premium Margin'
    },
    {
        get   : valueGetters.marketRisk,
        header: 'Market Risk'
    },
    {
        get   : valueGetters.liquRisk,
        header: 'Liqu Risk'
    },
    {
        get   : valueGetters.longOptionCredit,
        header: 'Long Option Credit'
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