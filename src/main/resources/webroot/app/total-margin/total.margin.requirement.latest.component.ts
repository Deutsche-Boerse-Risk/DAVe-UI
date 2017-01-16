import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {TotalMarginService} from './total.margin.service';
import {TotalMarginData} from './total.margin.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';

export const routingKeys: string[] = ['clearer', 'pool', 'member', 'account', 'ccy'];

@Component({
    moduleId: module.id,
    templateUrl: 'total.margin.requirement.latest.component.html',
    styleUrls: ['../common.component.css']
})
export class TotalMarginRequirementLatestComponent extends AbstractLatestListComponent<TotalMarginData> {

    constructor(private totalMarginService: TotalMarginService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.totalMarginService.getTotalMarginLatest(this.routeParams['clearer'], this.routeParams['pool'],
            this.routeParams['member'], this.routeParams['account'], this.routeParams['ccy'])
            .subscribe(
                (rows: TotalMarginData[]) => {
                    this.processData(rows);
                },
                (err: ErrorResponse) => {
                    this.errorMessage = 'Server returned status ' + err.status;
                    this.initialLoad = false;
                });
    }

    public get defaultOrdering(): (OrderingCriteria<TotalMarginData> | OrderingValueGetter<TotalMarginData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): ExportColumn<TotalMarginData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Latest Total Margin Requirements';
    }

    protected get rootRoutePath(): string {
        return '/totalMarginRequirementLatest';
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

export const valueGetters = {
    clearer: (row: TotalMarginData) => {
        return row.clearer;
    },
    pool: (row: TotalMarginData) => {
        return row.pool;
    },
    member: (row: TotalMarginData) => {
        return row.member;
    },
    account: (row: TotalMarginData) => {
        return row.account;
    },
    ccy: (row: TotalMarginData) => {
        return row.ccy;
    },
    adjustedMargin: (row: TotalMarginData) => {
        return row.adjustedMargin;
    },
    unadjustedMargin: (row: TotalMarginData) => {
        return row.unadjustedMargin;
    },
    received: (row: TotalMarginData) => {
        return row.received;
    }
};

const defaultOrdering: (OrderingCriteria<TotalMarginData> | OrderingValueGetter<TotalMarginData>)[] = [
    {
        get: valueGetters.adjustedMargin,
        descending: true
    },
    valueGetters.clearer,
    valueGetters.pool,
    valueGetters.member,
    valueGetters.account,
    valueGetters.ccy
];

export const exportKeys: ExportColumn<TotalMarginData>[] = [
    {
        get: valueGetters.clearer,
        header: 'Clearer'
    },
    {
        get: valueGetters.pool,
        header: 'Collateral Pool'
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
        get: valueGetters.ccy,
        header: 'Ccy'
    },
    {
        get: (row: TotalMarginData) => {
            return row.bizDt
        },
        header: 'BizDt'
    },
    {
        get: valueGetters.unadjustedMargin,
        header: 'Unadjusted Margin'
    },
    {
        get: valueGetters.adjustedMargin,
        header: 'Adjusted Margin'
    },
    {
        get: valueGetters.received,
        header: 'Last update'
    }
];

//</editor-fold>