import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {PositionReportData} from './position.report.types';
import {PositionReportsService} from './position.reports.service';

import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';

import {exportKeys, routingKeys, valueGetters} from './position.report.latest.component';

@Component({
    moduleId: module.id,
    templateUrl: 'position.report.history.component.html',
    styleUrls: ['../common.component.css']
})
export class PositionReportHistoryComponent extends AbstractHistoryListComponent<PositionReportData> {

    constructor(private positionReportsService: PositionReportsService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.positionReportsService.getPositionReportHistory(this.routeParams['clearer'], this.routeParams['member'],
            this.routeParams['account'], this.routeParams['class'], this.routeParams['symbol'],
            this.routeParams['putCall'], this.routeParams['strikePrice'], this.routeParams['optAttribute'],
            this.routeParams['maturityMonthYear'])
            .subscribe(
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
                type: 'date',
                value: record.received
            },
            {
                label: 'NetLS',
                type: 'number',
                value: record.netLS,
            },
            {
                label: 'NetEA',
                type: 'number',
                value: record.netEA,
            },
            {
                label: 'MVar',
                type: 'number',
                value: record.mVar,
            },
            {
                label: 'CompVar',
                type: 'number',
                value: record.compVar,
            },
            {
                label: 'Delta',
                type: 'number',
                value: record.delta,
            },
            {
                label: 'LiquiAddOn',
                type: 'number',
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
        return '/positionReportLatest';
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

const defaultOrdering: (OrderingCriteria<PositionReportData> | OrderingValueGetter<PositionReportData>)[] = [{
    get: valueGetters.received,
    descending: true
}];

//</editor-fold>