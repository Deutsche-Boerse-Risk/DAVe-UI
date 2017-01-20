import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {RiskLimitsService} from './risk.limits.service';
import {RiskLimitsData} from './risk.limits.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';

export const routingKeys: string[] = ['clearer', 'member', 'maintainer', 'limitType'];

@Component({
    moduleId: module.id,
    templateUrl: 'risk.limit.latest.component.html',
    styleUrls: ['../common.component.css']
})
export class RiskLimitLatestComponent extends AbstractLatestListComponent<RiskLimitsData> {

    constructor(private riskLimitsService: RiskLimitsService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.riskLimitsService.getRiskLimitsLatest(this.routeParams['clearer'], this.routeParams['member'],
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
        return 'Risk Limits';
    }

    protected get rootRoutePath(): string {
        return '/riskLimitLatest';
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

export const valueGetters = {
    clearer: (row: RiskLimitsData) => {
        return row.clearer;
    },
    member: (row: RiskLimitsData) => {
        return row.member;
    },
    maintainer: (row: RiskLimitsData) => {
        return row.maintainer;
    },
    limitType: (row: RiskLimitsData) => {
        return row.limitType;
    },
    utilization: (row: RiskLimitsData) => {
        return row.utilization;
    },
    warningLevel: (row: RiskLimitsData) => {
        return row.warningLevel;
    },
    warningUtil: (row: RiskLimitsData) => {
        return row.warningUtil;
    },
    throttleLevel: (row: RiskLimitsData) => {
        return row.throttleLevel;
    },
    throttleUtil: (row: RiskLimitsData) => {
        return row.throttleUtil;
    },
    rejectLevel: (row: RiskLimitsData) => {
        return row.rejectLevel;
    },
    rejectUtil: (row: RiskLimitsData) => {
        return row.rejectUtil;
    },
    received: (row: RiskLimitsData) => {
        return row.received;
    }
};

const defaultOrdering: (OrderingCriteria<RiskLimitsData> | OrderingValueGetter<RiskLimitsData>)[] = [
    {
        get: valueGetters.rejectUtil,
        descending: true
    },
    valueGetters.clearer,
    valueGetters.member,
    valueGetters.maintainer,
    valueGetters.limitType
];

export const exportKeys: ExportColumn<RiskLimitsData>[] = [
    {
        get: valueGetters.clearer,
        header: 'Clearer'
    },
    {
        get: valueGetters.member,
        header: 'Member / Client'
    },
    {
        get: valueGetters.maintainer,
        header: 'Maintainer'
    },
    {
        get: valueGetters.limitType,
        header: 'Type'
    },
    {
        get: valueGetters.utilization,
        header: 'Utilization'
    },
    {
        get: valueGetters.warningLevel,
        header: 'Warning Level Limit'
    },
    {
        get: valueGetters.warningUtil,
        header: 'Warning Level Utilization'
    },
    {
        get: valueGetters.throttleLevel,
        header: 'Throttle Level Limit'
    },
    {
        get: valueGetters.throttleUtil,
        header: 'Throttle Level Utilization'
    },
    {
        get: valueGetters.rejectLevel,
        header: 'Stop Level Limit'
    },
    {
        get: valueGetters.rejectUtil,
        header: 'Stop Level Utilization'
    },
    {
        get: valueGetters.received,
        header: 'Last update'
    }
];

//</editor-fold>
