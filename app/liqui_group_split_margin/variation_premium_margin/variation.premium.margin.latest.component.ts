import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ValueGetter} from '@dbg-riskit/dave-ui-common';
import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-devkit';
import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {AbstractLiquiGroupSplitMarginLatestComponent} from '../abstract.liqui.group.split.margin.latest.component';
import {LiquiGroupSplitMarginService} from '../liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData} from '../liqui.group.split.margin.types';

@Component({
    moduleId   : module.id,
    templateUrl: 'variation.premium.margin.latest.component.html',
    styleUrls  : ['../../../' + COMPONENT_CSS]
})
export class VariationPremiumMarginLatestComponent extends AbstractLiquiGroupSplitMarginLatestComponent {

    constructor(liquiGroupSplitMarginService: LiquiGroupSplitMarginService, route: ActivatedRoute,
        dateFormatter: DateFormatter, numberFormatter: DecimalPipe) {
        super(liquiGroupSplitMarginService, route, dateFormatter, numberFormatter);
    }

    public get exportKeys(): CSVExportColumn<LiquiGroupSplitMarginData>[] {
        return exportKeys;
    }

    public get filterValueGetters(): ValueGetter<LiquiGroupSplitMarginData>[] {
        return filterValueGetters;
    }

    public get rootRouteTitle(): string {
        return 'Latest Variation / Premium Margin';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.VARIATION_PREMIUM_MARGIN_LATEST;
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
    variationPremiumPayment: (row: LiquiGroupSplitMarginData) => row.variationPremiumPayment,
    received               : (row: LiquiGroupSplitMarginData) => row.received
};

export const filterValueGetters = [
    valueGetters.member,
    valueGetters.account,
    valueGetters.liquidationGroup,
    valueGetters.liquidationGroupSplit,
    valueGetters.premiumMargin,
    valueGetters.variationPremiumPayment,
    valueGetters.marginCurrency
];

export const exportKeys: CSVExportColumn<LiquiGroupSplitMarginData>[] = [
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
        get   : valueGetters.variationPremiumPayment,
        header: 'Variation Premium Payment'
    },
    {
        get   : valueGetters.received,
        header: 'Last update'
    }
];

//</editor-fold>