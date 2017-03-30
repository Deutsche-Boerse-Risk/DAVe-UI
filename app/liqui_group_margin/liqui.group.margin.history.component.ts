import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {LiquiGroupMarginService} from './liqui.group.margin.service';
import {LiquiGroupMarginData} from './liqui.group.margin.types';

import {DateFormatter} from '../common/common.module';
import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria} from '../datatable/data.table.column.directive';

import {exportKeys, routingKeys, valueGetters} from './liqui.group.margin.latest.component';
import {LIQUI_GROUP_MARGIN_LATEST} from '../routes/routing.paths';

@Component({
    moduleId   : module.id,
    templateUrl: 'liqui.group.margin.history.component.html',
    styleUrls  : ['../common.component.css']
})
export class LiquiGroupMarginHistoryComponent extends AbstractHistoryListComponent<LiquiGroupMarginData> {

    constructor(private liquiGroupMarginService: LiquiGroupMarginService,
        route: ActivatedRoute, dateFormatter: DateFormatter, numberPipe: DecimalPipe) {
        super(route, dateFormatter, numberPipe);
    }

    protected loadData(): void {
        this.liquiGroupMarginService.getLiquiGroupMarginHistory({
            clearer       : this.routeParams['clearer'],
            member        : this.routeParams['member'],
            account       : this.routeParams['account'],
            marginClass   : this.routeParams['marginClass'],
            marginCurrency: this.routeParams['marginCurrency']
        }).subscribe(
            (rows: LiquiGroupMarginData[]) => {
                this.processData(rows);
            }, (err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    protected getTickFromRecord(record: LiquiGroupMarginData): LineChartColumn[] {
        return [
            {
                type : 'date',
                value: record.received
            },
            {
                label: 'Variation / Liquidation Marign',
                type : 'number',
                value: 0 // TODO: record.variLiqui
            },
            {
                label: 'Premium Margin',
                type : 'number',
                value: record.premiumMargin
            },
            {
                label: 'Futures Spread Margin',
                type : 'number',
                value: record.futuresSpreadMargin
            },
            {
                label: 'Additional Margin',
                type : 'number',
                value: record.additionalMargin
            }
        ];
    }

    public get defaultOrdering(): OrderingCriteria<LiquiGroupMarginData>[] {
        return defaultOrdering;
    }

    public get exportKeys(): ExportColumn<LiquiGroupMarginData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Liquidation Group Margin History';
    }

    protected get rootRoutePath(): string {
        return '/' + LIQUI_GROUP_MARGIN_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

const defaultOrdering: OrderingCriteria<LiquiGroupMarginData>[] = [
    {
        get       : valueGetters.received,
        descending: true
    }
];

//</editor-fold>
