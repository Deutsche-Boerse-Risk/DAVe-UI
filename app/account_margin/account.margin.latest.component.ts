import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {COMPONENT_CSS, ValueGetter} from '@dbg-riskit/dave-ui-common';
import {OrderingCriteria} from '@dbg-riskit/dave-ui-datatable';
import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {AccountMarginService} from './account.margin.service';
import {AccountMarginData, AccountMarginParams} from './account.margin.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';

import {Subscription} from 'rxjs/Subscription';

export const routingKeys: (keyof AccountMarginParams)[] = [
    'clearer',
    'member',
    'account',
    'marginCurrency'
];

@Component({
    moduleId   : module.id,
    templateUrl: 'account.margin.latest.component.html',
    styleUrls  : ['../../' + COMPONENT_CSS]
})
export class AccountMarginLatestComponent extends AbstractLatestListComponent<AccountMarginData> {

    constructor(private accountMarginService: AccountMarginService, route: ActivatedRoute, dateFormatter: DateFormatter,
        numberFormatter: DecimalPipe) {
        super(route, dateFormatter, numberFormatter);
    }

    protected loadData(): Subscription {
        return this.accountMarginService.getAccountMarginLatest({
            clearer       : this.routeParams['clearer'],
            member        : this.routeParams['member'],
            account       : this.routeParams['account'],
            marginCurrency: this.routeParams['marginCurrency']
        }).subscribe(
            (rows: AccountMarginData[]) => {
                this.processData(rows);
            });
    }

    public get defaultOrdering(): (OrderingCriteria<AccountMarginData> | ValueGetter<AccountMarginData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): CSVExportColumn<AccountMarginData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Latest Account Margin';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.ACCOUNT_MARGIN_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

export const valueGetters = {
    clearer                    : (row: AccountMarginData) => row.clearer,
    member                     : (row: AccountMarginData) => row.member,
    account                    : (row: AccountMarginData) => row.account,
    marginCurrency             : (row: AccountMarginData) => row.marginCurrency,
    pool                       : (row: AccountMarginData) => row.pool,
    marginReqInMarginCurr      : (row: AccountMarginData) => row.marginReqInMarginCurr,
    marginReqInClrCurr         : (row: AccountMarginData) => row.marginReqInClrCurr,
    unadjustedMarginRequirement: (row: AccountMarginData) => row.unadjustedMarginRequirement,
    variationPremiumPayment    : (row: AccountMarginData) => row.variationPremiumPayment,
    received                   : (row: AccountMarginData) => row.received
};

const defaultOrdering: (OrderingCriteria<AccountMarginData> | ValueGetter<AccountMarginData>)[] = [
    {
        get       : valueGetters.marginReqInMarginCurr,
        descending: true
    },
    valueGetters.clearer,
    valueGetters.member,
    valueGetters.account,
    valueGetters.marginCurrency
];

export const exportKeys: CSVExportColumn<AccountMarginData>[] = [
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
        get   : valueGetters.marginCurrency,
        header: 'Margin currency'
    },
    {
        get   : (row: AccountMarginData) => row.clearingCurrency,
        header: 'Clearing currency'
    },
    {
        get   : valueGetters.pool,
        header: 'Collateral Pool'
    },
    {
        get   : (row: AccountMarginData) => row.businessDate,
        header: 'Business date'
    },
    {
        get   : valueGetters.marginReqInMarginCurr,
        header: 'Margin requirement in margin currency'
    },
    {
        get   : valueGetters.marginReqInClrCurr,
        header: 'Margin requirement in clearing currency'
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