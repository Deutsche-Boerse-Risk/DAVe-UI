import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {PositionReportData} from './position.report.types';
import {PositionReportsService} from './position.reports.service';

import {DateFormatter} from '../common/common.module';
import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';

import {exportKeys, routingKeys, valueGetters} from './position.report.latest.component';
import {POSITION_REPORTS_LATEST} from '../routes/routing.paths';

@Component({
    moduleId   : module.id,
    templateUrl: 'position.report.history.component.html',
    styleUrls  : ['../common.component.css']
})
export class PositionReportHistoryComponent extends AbstractHistoryListComponent<PositionReportData> {

    constructor(private positionReportsService: PositionReportsService,
        route: ActivatedRoute, dateFormatter: DateFormatter, numberPipe: DecimalPipe) {
        super(route, dateFormatter, numberPipe);
    }

    protected loadData(): void {
        this.positionReportsService.getPositionReportHistory({
            clearer              : this.routeParams['clearer'],
            member               : this.routeParams['member'],
            account              : this.routeParams['account'],
            liquidationGroup     : this.routeParams['liquidationGroup'],
            liquidationGroupSplit: this.routeParams['liquidationGroupSplit'],
            product              : this.routeParams['product'],
            callPut              : this.routeParams['callPut'],
            contractYear         : this.routeParams['contractYear'],
            contractMonth        : this.routeParams['contractMonth'],
            expiryDay            : this.routeParams['expiryDay'],
            exercisePrice        : this.routeParams['exercisePrice'],
            version              : this.routeParams['version'],
            flexContractSymbol   : this.routeParams['flexContractSymbol']
        }).subscribe(
            (rows: PositionReportData[]) => {
                this.processData(rows);
            },
            (err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    protected getTickFromRecord(record: PositionReportData): LineChartColumn[] {
        return [
            {
                type : 'date',
                value: record.received
            },
            {
                label: 'NetLS',
                type : 'number',
                value: record.netQuantityLs
            },
            {
                label: 'NetEA',
                type : 'number',
                value: record.netQuantityEa
            },
            {
                label: 'MVar',
                type : 'number',
                value: record.mVar
            },
            {
                label: 'CompVar',
                type : 'number',
                value: record.compVar
            },
            {
                label: 'Delta',
                type : 'number',
                value: record.normalizedDelta
            },
            {
                label: 'LiquiAddOn',
                type : 'number',
                value: record.compLiquidityAddOn
            }
        ];
    }

    public get defaultOrdering(): (OrderingCriteria<PositionReportData> | OrderingValueGetter<PositionReportData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): ExportColumn<PositionReportData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Position Report History';
    }

    protected get rootRoutePath(): string {
        return '/' + POSITION_REPORTS_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

const defaultOrdering: (OrderingCriteria<PositionReportData> | OrderingValueGetter<PositionReportData>)[] = [
    {
        get       : valueGetters.received,
        descending: true
    }
];

//</editor-fold>