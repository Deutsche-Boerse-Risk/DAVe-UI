import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {RiskLimitsService} from './risk.limits.service';
import {RiskLimitsData} from './risk.limits.types';

import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';

import {exportKeys, routingKeys, valueGetters} from './risk.limit.latest.component';

@Component({
    moduleId: module.id,
    templateUrl: 'risk.limit.history.component.html',
    styleUrls: ['../common.component.css']
})
export class RiskLimitHistoryComponent extends AbstractHistoryListComponent<RiskLimitsData> {

    constructor(private riskLimitsService: RiskLimitsService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.riskLimitsService.getRiskLimitsHistory(this.routeParams['clearer'], this.routeParams['member'],
            this.routeParams['maintainer'], this.routeParams['limitType'])
            .subscribe(
                (rows: RiskLimitsData[]) => {
                    this.processData(rows);
                },
                (err: ErrorResponse) => {
                    this.errorMessage = 'Server returned status ' + err.status;
                    this.initialLoad = false;
                });
    }

    protected getTickFromRecord(record: RiskLimitsData): LineChartColumn[] {
        return [
            {
                type: 'date',
                value: record.received
            },
            {
                label: 'Limit utilization',
                type: 'number',
                value: record.utilization,
            },
            {
                label: 'Warning level',
                type: 'number',
                value: record.warningLevel,
            },
            {
                label: 'Throttle level',
                type: 'number',
                value: record.throttleLevel,
            },
            {
                label: 'Stop level',
                type: 'number',
                value: record.rejectLevel,
            }
        ];
    }

    public get defaultOrdering(): (OrderingCriteria<RiskLimitsData> | OrderingValueGetter<RiskLimitsData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): ExportColumn<RiskLimitsData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Risk Limit History';
    }

    protected get rootRoutePath(): string {
        return '/riskLimitLatest';
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

const defaultOrdering: (OrderingCriteria<RiskLimitsData> | OrderingValueGetter<RiskLimitsData>)[] = [{
    get: valueGetters.received,
    descending: true
}];

//</editor-fold>
