import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ValueGetter} from '@dbg-riskit/dave-ui-common';
import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-devkit';
import {OrderingCriteria} from '@dbg-riskit/dave-ui-datatable';
import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {RiskLimitUtilizationService} from './risk.limit.utilization.service';
import {RiskLimitUtilizationData} from './risk.limit.utilization.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';

import {Subscription} from 'rxjs/Subscription';

export const routingKeys: string[] = ['clearer', 'member', 'maintainer', 'limitType'];

@Component({
    moduleId   : module.id,
    templateUrl: 'risk.limit.utilization.latest.component.html',
    styleUrls  : ['../../' + COMPONENT_CSS]
})
export class RiskLimitUtilizationLatestComponent extends AbstractLatestListComponent<RiskLimitUtilizationData> {

    constructor(private riskLimitUtilizationService: RiskLimitUtilizationService, route: ActivatedRoute,
        dateFormatter: DateFormatter, numberFormatter: DecimalPipe) {
        super(route, dateFormatter, numberFormatter);
    }

    protected loadData(): Subscription {
        return this.riskLimitUtilizationService.getRiskLimitUtilizationLatest({
            clearer   : this.routeParams['clearer'],
            member    : this.routeParams['member'],
            maintainer: this.routeParams['maintainer'],
            limitType : this.routeParams['limitType']
        }).subscribe(
            (rows: RiskLimitUtilizationData[]) => {
                this.processData(rows);
            });
    }

    public get defaultOrdering(): (
        OrderingCriteria<RiskLimitUtilizationData>
        | ValueGetter<RiskLimitUtilizationData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): CSVExportColumn<RiskLimitUtilizationData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Latest Risk Limit Utilization';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.RISK_LIMIT_UTILIZATION_LATEST;
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
    | ValueGetter<RiskLimitUtilizationData>)[] = [
    {
        get       : valueGetters.rejectUtil,
        descending: true
    },
    valueGetters.clearer,
    valueGetters.member,
    valueGetters.maintainer,
    valueGetters.limitType
];

export const exportKeys: CSVExportColumn<RiskLimitUtilizationData>[] = [
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
