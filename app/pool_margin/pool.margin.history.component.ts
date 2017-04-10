import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {PoolMarginService} from './pool.margin.service';
import {PoolMarginData} from './pool.margin.types';

import {DateFormatter} from '../common/common.module';
import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';

import {exportKeys, routingKeys, valueGetters} from './pool.margin.latest.component';

@Component({
    moduleId   : module.id,
    templateUrl: 'pool.margin.history.component.html',
    styleUrls  : ['../common.component.css']
})
export class PoolMarginHistoryComponent extends AbstractHistoryListComponent<PoolMarginData> {

    constructor(private poolMarginService: PoolMarginService,
        route: ActivatedRoute, dateFormatter: DateFormatter, numberPipe: DecimalPipe) {
        super(route, dateFormatter, numberPipe);
    }

    protected loadData(): void {
        this.poolMarginService.getPoolMarginHistory({
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

    protected getTickFromRecord(record: PoolMarginData): LineChartColumn[] {
        return [
            {
                type : 'date',
                value: record.received
            },
            {
                label: 'Margin Requirement',
                type : 'number',
                value: 0// TODO: record.marginRequirement
            },
            {
                label: 'Security Collateral',
                type : 'number',
                value: 0// TODO: record.securityCollateral
            },
            {
                label: 'Cash Balance',
                type : 'number',
                value: 0// TODO: record.cashBalance
            },
            {
                label: 'Shortfall Surplus',
                type : 'number',
                value: 0// TODO: record.shortfallSurplus
            },
            {
                label: 'Margin Call',
                type : 'number',
                value: 0// TODO: record.marginCall
            }
        ];
    }

    public get defaultOrdering(): (OrderingCriteria<PoolMarginData> | OrderingValueGetter<PoolMarginData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): ExportColumn<PoolMarginData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Pool Margin History';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.POOL_MARGIN_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

const defaultOrdering: (
    OrderingCriteria<PoolMarginData>
    | OrderingValueGetter<PoolMarginData>)[] = [
    {
        get       : valueGetters.received,
        descending: true
    }
];

//</editor-fold>
