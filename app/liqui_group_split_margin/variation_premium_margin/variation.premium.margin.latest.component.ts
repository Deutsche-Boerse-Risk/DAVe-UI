import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {COMPONENT_CSS} from '@dbg-riskit/DAVe-UI-common';
import {CSVExportColumn} from '@dbg-riskit/DAVe-UI-file';

import {AbstractLiquiGroupSplitMarginLatestComponent} from '../abstract.liqui.group.split.margin.latest.component';
import {LiquiGroupSplitMarginService} from '../liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData} from '../liqui.group.split.margin.types';

@Component({
    moduleId   : module.id,
    templateUrl: 'variation.premium.margin.latest.component.html',
    styleUrls  : ['../../../' + COMPONENT_CSS]
})
export class VariationPremiumMarginLatestComponent extends AbstractLiquiGroupSplitMarginLatestComponent {

    constructor(liquiGroupSplitMarginService: LiquiGroupSplitMarginService, route: ActivatedRoute) {
        super(liquiGroupSplitMarginService, route);
    }

    public get exportKeys(): CSVExportColumn<LiquiGroupSplitMarginData>[] {
        return exportKeys;
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
    premiumMargin          : (row: LiquiGroupSplitMarginData) => row.premiumMargin,
    variationPremiumPayment: (row: LiquiGroupSplitMarginData) => row.variationPremiumPayment,
    received               : (row: LiquiGroupSplitMarginData) => row.received
};

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
        get   : (row: LiquiGroupSplitMarginData) => row.marginCurrency,
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
        header: 'Variation / Premium Cash Flow'
    },
    {
        get   : valueGetters.received,
        header: 'Last update'
    }
];

//</editor-fold>