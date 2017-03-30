import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {LiquiGroupSplitMarginService} from './liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData} from './liqui.group.split.margin.types';

import {DateFormatter} from '../common/common.module';
import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria} from '../datatable/data.table.column.directive';

import {exportKeys, routingKeys, valueGetters} from './liqui.group.split.margin.latest.component';
import {LIQUI_GROUP_MARGIN_LATEST} from '../routes/routing.paths';

@Component({
    moduleId   : module.id,
    templateUrl: 'liqui.group.split.margin.history.component.html',
    styleUrls  : ['../common.component.css']
})
export class LiquiGroupSplitMarginHistoryComponent extends AbstractHistoryListComponent<LiquiGroupSplitMarginData> {

    constructor(private liquiGroupSplitMarginService: LiquiGroupSplitMarginService,
        route: ActivatedRoute, dateFormatter: DateFormatter, numberPipe: DecimalPipe) {
        super(route, dateFormatter, numberPipe);
    }

    protected loadData(): void {
        this.liquiGroupSplitMarginService.getLiquiGroupSplitMarginHistory({
            clearer              : this.routeParams['clearer'],
            member               : this.routeParams['member'],
            account              : this.routeParams['account'],
            liquidationGroup     : this.routeParams['liquidationGroup'],
            liquidationGroupSplit: this.routeParams['liquidationGroupSplit'],
            marginCurrency       : this.routeParams['marginCurrency']
        }).subscribe(
            (rows: LiquiGroupSplitMarginData[]) => {
                this.processData(rows);
            }, (err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    protected getTickFromRecord(record: LiquiGroupSplitMarginData): LineChartColumn[] {
        return [
            {
                type : 'date',
                value: record.received
            },
            {
                label: 'Premium Margin',
                type : 'number',
                value: record.premiumMargin
            },
            {
                label: 'Market Risk',
                type : 'number',
                value: record.marketRisk
            },
            {
                label: 'Liqu Risk',
                type : 'number',
                value: record.liquRisk
            },
            {
                label: 'Long Option Credit',
                type : 'number',
                value: record.longOptionCredit
            },
            {
                label: 'Variation Premium Payment',
                type : 'number',
                value: record.variationPremiumPayment
            }
        ];
    }

    public get defaultOrdering(): OrderingCriteria<LiquiGroupSplitMarginData>[] {
        return defaultOrdering;
    }

    public get exportKeys(): ExportColumn<LiquiGroupSplitMarginData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Liquidation Group Split Margin History';
    }

    protected get rootRoutePath(): string {
        return '/' + LIQUI_GROUP_MARGIN_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

const defaultOrdering: OrderingCriteria<LiquiGroupSplitMarginData>[] = [
    {
        get       : valueGetters.received,
        descending: true
    }
];

//</editor-fold>
