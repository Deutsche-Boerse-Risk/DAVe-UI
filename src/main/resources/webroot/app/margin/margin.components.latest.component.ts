import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {MarginComponentsService} from './margin.components.service';
import {MarginComponentsRowData} from './margin.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';

export const routingKeys: string[] = ['clearer', 'member', 'account', 'class', 'ccy'];

@Component({
    moduleId: module.id,
    templateUrl: 'margin.components.latest.component.html',
    styleUrls: ['../common.component.css']
})
export class MarginComponentsLatestComponent extends AbstractLatestListComponent<MarginComponentsRowData> {

    constructor(private marginComponentsService: MarginComponentsService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.marginComponentsService.getMarginComponentsLatest(this.routeParams['clearer'], this.routeParams['member'],
            this.routeParams['account'], this.routeParams['class'], this.routeParams['ccy'])
            .subscribe(
                (rows: MarginComponentsRowData[]) => {
                    this.processData(rows);
                },
                (err: ErrorResponse) => {
                    this.errorMessage = 'Server returned status ' + err.status;
                    this.initialLoad = false;
                });
    }

    public get defaultOrdering(): (OrderingCriteria<MarginComponentsRowData> | OrderingValueGetter<MarginComponentsRowData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): ExportColumn<MarginComponentsRowData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Latest Margin Components';
    }

    protected get rootRoutePath(): string {
        return '/marginComponentLatest';
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

export const valueGetters = {
    clearer: (row: MarginComponentsRowData) => {
        return row.clearer;
    },
    member: (row: MarginComponentsRowData) => {
        return row.member;
    },
    account: (row: MarginComponentsRowData) => {
        return row.account;
    },
    class: (row: MarginComponentsRowData) => {
        return row.class;
    },
    ccy: (row: MarginComponentsRowData) => {
        return row.ccy;
    },
    variationMargin: (row: MarginComponentsRowData) => {
        return row.variationMargin;
    },
    liquiMargin: (row: MarginComponentsRowData) => {
        return row.liquiMargin;
    },
    premiumMargin: (row: MarginComponentsRowData) => {
        return row.premiumMargin;
    },
    spreadMargin: (row: MarginComponentsRowData) => {
        return row.spreadMargin;
    },
    additionalMargin: (row: MarginComponentsRowData) => {
        return row.additionalMargin;
    },
    received: (row: MarginComponentsRowData) => {
        return row.received;
    }
};

const defaultOrdering: (OrderingCriteria<MarginComponentsRowData> | OrderingValueGetter<MarginComponentsRowData>)[] = [
    {
        get: (row: MarginComponentsRowData) => {
            return Math.abs(row.additionalMargin);
        },
        descending: true
    },
    valueGetters.clearer,
    valueGetters.member,
    valueGetters.account,
    valueGetters.class,
    valueGetters.ccy
];

export const exportKeys: ExportColumn<MarginComponentsRowData>[] = [
    {
        get: valueGetters.clearer,
        header: 'Clearer'
    },
    {
        get: valueGetters.member,
        header: 'Member / Client'
    },
    {
        get: valueGetters.account,
        header: 'Account'
    },
    {
        get: valueGetters.class,
        header: 'Liq Grp / Margin Class'
    },
    {
        get: valueGetters.ccy,
        header: 'Ccy'
    },
    {
        get: (row: MarginComponentsRowData) => {
            return row.bizDt;
        },
        header: 'BizDt'
    },
    {
        get: valueGetters.variationMargin,
        header: 'Variation Margin'
    },
    {
        get: valueGetters.liquiMargin,
        header: 'Liquidation Margin'
    },
    {
        get: valueGetters.premiumMargin,
        header: 'Premium Margin'
    },
    {
        get: valueGetters.spreadMargin,
        header: 'Spread Margin'
    },
    {
        get: valueGetters.additionalMargin,
        header: 'Total Margin'
    },
    {
        get: (row: MarginComponentsRowData) => {
            return row.variLiqui;
        },
        header: 'VariLiqui'
    },
    {
        get: valueGetters.received,
        header: 'Last update'
    }
];

//</editor-fold>