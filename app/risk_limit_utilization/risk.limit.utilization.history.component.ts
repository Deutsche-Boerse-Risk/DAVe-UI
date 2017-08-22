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

import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';

import {exportKeys, routingKeys, valueGetters} from './risk.limit.utilization.latest.component';

import {Subscription} from 'rxjs/Subscription';

@Component({
    moduleId   : module.id,
    templateUrl: 'risk.limit.utilization.history.component.html',
    styleUrls  : ['../../' + COMPONENT_CSS]
})
export class RiskLimitUtilizationHistoryComponent extends AbstractHistoryListComponent<RiskLimitUtilizationData> {

    constructor(private riskLimitUtilizationService: RiskLimitUtilizationService,
        route: ActivatedRoute, dateFormatter: DateFormatter, numberPipe: DecimalPipe) {
        super(route, dateFormatter, numberPipe);
    }

    protected loadData(): Subscription {
        return this.riskLimitUtilizationService.getRiskLimitUtilizationHistory({
            clearer   : this.routeParams['clearer'],
            member    : this.routeParams['member'],
            maintainer: this.routeParams['maintainer'],
            limitType : this.routeParams['limitType']
        }).subscribe(
            (rows: RiskLimitUtilizationData[]) => {
                this.processData(rows);
            });
    }

    protected getTickFromRecord(record: RiskLimitUtilizationData): LineChartColumn[] {
        return [
            {
                type : 'date',
                value: record.received
            },
            {
                label: 'Limit utilization',
                type : 'number',
                value: record.utilization
            },
            {
                label: 'Warning level',
                type : 'number',
                value: record.warningLevel
            },
            {
                label: 'Throttle level',
                type : 'number',
                value: record.throttleLevel
            },
            {
                label: 'Stop level',
                type : 'number',
                value: record.rejectLevel
            }
        ];
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
        return 'Risk Limit Utilization History';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.RISK_LIMIT_UTILIZATION_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

const defaultOrdering: (
    OrderingCriteria<RiskLimitUtilizationData>
    | ValueGetter<RiskLimitUtilizationData>)[] = [
    {
        get       : valueGetters.received,
        descending: true
    }
];

//</editor-fold>
