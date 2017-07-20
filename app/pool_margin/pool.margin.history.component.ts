import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {COMPONENT_CSS, ValueGetter} from '@dbg-riskit/dave-ui-common';
import {OrderingCriteria} from '@dbg-riskit/dave-ui-datatable';
import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {PoolMarginService} from './pool.margin.service';
import {PoolMarginData} from './pool.margin.types';

import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';

import {exportKeys, routingKeys, valueGetters} from './pool.margin.latest.component';

import {Subscription} from 'rxjs/Subscription';

@Component({
    moduleId   : module.id,
    templateUrl: 'pool.margin.history.component.html',
    styleUrls  : ['../../' + COMPONENT_CSS]
})
export class PoolMarginHistoryComponent extends AbstractHistoryListComponent<PoolMarginData> {

    constructor(private poolMarginService: PoolMarginService,
        route: ActivatedRoute, dateFormatter: DateFormatter, numberPipe: DecimalPipe) {
        super(route, dateFormatter, numberPipe);
    }

    protected loadData(): Subscription {
        return this.poolMarginService.getPoolMarginHistory({
            clearer       : this.routeParams['clearer'],
            pool          : this.routeParams['pool'],
            marginCurrency: this.routeParams['marginCurrency']
        }).subscribe(
            (rows: PoolMarginData[]) => {
                this.processData(rows);
            });
    }

    protected getTickFromRecord(record: PoolMarginData): LineChartColumn[] {
        return [
            {
                type : 'date',
                value: record.received
            },
            {
                label: 'Required Margin',
                type : 'number',
                value: record.requiredMargin
            },
            {
                label: 'Cash Collateral Amount',
                type : 'number',
                value: record.cashCollateralAmount
            },
            {
                label: 'Adjusted Securities',
                type : 'number',
                value: record.adjustedSecurities
            },
            {
                label: 'Adjusted Guarantee',
                type : 'number',
                value: record.adjustedGuarantee
            },
            {
                label: 'overUnderInMarginCurr',
                type : 'number',
                value: record.overUnderInMarginCurr
            },
            {
                label: 'overUnderInClrRptCurr',
                type : 'number',
                value: record.overUnderInClrRptCurr
            },
            {
                label: 'variPremInMarginCurr',
                type : 'number',
                value: record.variPremInMarginCurr
            },
            {
                label: 'Adjusted Exchange Rate',
                type : 'number',
                value: record.adjustedExchangeRate
            }
        ];
    }

    public get defaultOrdering(): (OrderingCriteria<PoolMarginData> | ValueGetter<PoolMarginData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): CSVExportColumn<PoolMarginData>[] {
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
    | ValueGetter<PoolMarginData>)[] = [
    {
        get       : valueGetters.received,
        descending: true
    }
];

//</editor-fold>
