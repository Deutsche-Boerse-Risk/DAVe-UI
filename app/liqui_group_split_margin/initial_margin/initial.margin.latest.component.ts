import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {AbstractLiquiGroupSplitMarginLatestComponent} from '../abstract.liqui.group.split.margin.latest.component';
import {LiquiGroupSplitMarginService} from '../liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData} from '../liqui.group.split.margin.types';
import {ExportColumn} from '../../list/download.menu.component';

@Component({
    moduleId   : module.id,
    templateUrl: 'initial.margin.latest.component.html',
    styleUrls  : ['../../common.component.css']
})
export class InitialMarginLatestComponent extends AbstractLiquiGroupSplitMarginLatestComponent {

    constructor(liquiGroupSplitMarginService: LiquiGroupSplitMarginService, route: ActivatedRoute) {
        super(liquiGroupSplitMarginService, route);
    }

    public get exportKeys(): ExportColumn<LiquiGroupSplitMarginData>[] {
        return exportKeys;
    }

    public get rootRouteTitle(): string {
        return 'Latest Initial Margin';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.INITIAL_MARGIN_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

export const valueGetters = {
    clearer              : (row: LiquiGroupSplitMarginData) => row.clearer,
    member               : (row: LiquiGroupSplitMarginData) => row.member,
    account              : (row: LiquiGroupSplitMarginData) => row.account,
    liquidationGroup     : (row: LiquiGroupSplitMarginData) => row.liquidationGroup,
    liquidationGroupSplit: (row: LiquiGroupSplitMarginData) => row.liquidationGroupSplit,
    marketRisk           : (row: LiquiGroupSplitMarginData) => row.marketRisk,
    liquRisk             : (row: LiquiGroupSplitMarginData) => row.liquRisk,
    longOptionCredit     : (row: LiquiGroupSplitMarginData) => row.longOptionCredit,
    additionalMargin     : (row: LiquiGroupSplitMarginData) => row.additionalMargin,
    received             : (row: LiquiGroupSplitMarginData) => row.received
};

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
        get   : (row: LiquiGroupSplitMarginData) => row.marginCurrency,
        header: 'Margin Currency'
    },
    {
        get   : (row: LiquiGroupSplitMarginData) => row.businessDate,
        header: 'Business Date'
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
        get   : valueGetters.additionalMargin,
        header: 'Initial Margin'
    },
    {
        get   : valueGetters.received,
        header: 'Last update'
    }
];

//</editor-fold>