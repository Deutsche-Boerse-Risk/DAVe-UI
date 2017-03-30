import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {RiskLimitUtilizationService} from './risk.limit.utilization.service';
import {RiskLimitUtilizationData} from './risk.limit.utilization.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';
import {RISK_LIMIT_UTILIZATION_LATEST} from '../routes/routing.paths';

export const routingKeys: string[] = ['clearer', 'member', 'maintainer', 'limitType'];

@Component({
    moduleId   : module.id,
    templateUrl: 'risk.limit.utilization.latest.component.html',
    styleUrls  : ['../common.component.css']
})
export class RiskLimitUtilizationLatestComponent extends AbstractLatestListComponent<RiskLimitUtilizationData> {

    constructor(private riskLimitUtilizationService: RiskLimitUtilizationService,
        route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.riskLimitUtilizationService.getRiskLimitUtilizationLatest({
            clearer   : this.routeParams['clearer'],
            member    : this.routeParams['member'],
            maintainer: this.routeParams['maintainer'],
            limitType : this.routeParams['limitType']
        }).subscribe(
            (rows: RiskLimitUtilizationData[]) => {
                this.processData(rows);
            },
            (err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    public get defaultOrdering(): (
        OrderingCriteria<RiskLimitUtilizationData>
        | OrderingValueGetter<RiskLimitUtilizationData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): ExportColumn<RiskLimitUtilizationData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Risk Limit Utilization';
    }

    protected get rootRoutePath(): string {
        return '/' + RISK_LIMIT_UTILIZATION_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

export const valueGetters = {
    clearer      : (row: RiskLimitUtilizationData) => row.clearer,
    member       : (row: RiskLimitUtilizationData) => row.member,
    maintainer   : (row: RiskLimitUtilizationData) => row.maintainer,
    limitType    : (row: RiskLimitUtilizationData) => row.limitType,
    utilization  : (row: RiskLimitUtilizationData) => row.utilization,
    warningLevel : (row: RiskLimitUtilizationData) => row.warningLevel,
    warningUtil  : (row: RiskLimitUtilizationData) => row.warningUtil,
    throttleLevel: (row: RiskLimitUtilizationData) => row.throttleLevel,
    throttleUtil : (row: RiskLimitUtilizationData) => row.throttleUtil,
    rejectLevel  : (row: RiskLimitUtilizationData) => row.rejectLevel,
    rejectUtil   : (row: RiskLimitUtilizationData) => row.rejectUtil,
    received     : (row: RiskLimitUtilizationData) => row.received
};

const defaultOrdering: (
    OrderingCriteria<RiskLimitUtilizationData>
    | OrderingValueGetter<RiskLimitUtilizationData>)[] = [
    {
        get       : valueGetters.rejectUtil,
        descending: true
    },
    valueGetters.clearer,
    valueGetters.member,
    valueGetters.maintainer,
    valueGetters.limitType
];

export const exportKeys: ExportColumn<RiskLimitUtilizationData>[] = [
    {
        get   : valueGetters.clearer,
        header: 'Clearer'
    },
    {
        get   : valueGetters.member,
        header: 'Member / Client'
    },
    {
        get   : valueGetters.maintainer,
        header: 'Maintainer'
    },
    {
        get   : valueGetters.limitType,
        header: 'Type'
    },
    {
        get   : valueGetters.utilization,
        header: 'Utilization'
    },
    {
        get   : valueGetters.warningLevel,
        header: 'Warning Level Limit'
    },
    {
        get   : valueGetters.warningUtil,
        header: 'Warning Level Utilization'
    },
    {
        get   : valueGetters.throttleLevel,
        header: 'Throttle Level Limit'
    },
    {
        get   : valueGetters.throttleUtil,
        header: 'Throttle Level Utilization'
    },
    {
        get   : valueGetters.rejectLevel,
        header: 'Stop Level Limit'
    },
    {
        get   : valueGetters.rejectUtil,
        header: 'Stop Level Utilization'
    },
    {
        get   : valueGetters.received,
        header: 'Last update'
    }
];

//</editor-fold>
