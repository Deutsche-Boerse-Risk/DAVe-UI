import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../abstract.http.service';
import {RiskLimitsService} from './risk.limits.service';
import {RiskLimitsData} from './risk.limits.types';

import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';

import {exportKeys, routingKeys} from './risk.limit.latest.component';

const defaultOrdering = ['-received'];

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
            .then((rows: RiskLimitsData[]) => {
                this.processData(rows);
            })
            .catch((err: ErrorResponse) => {
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

    public get defaultOrdering(): string[] {
        return defaultOrdering;
    }

    protected get exportKeys(): string[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    protected get rootRouteTitle(): string {
        return 'Risk Limit History';
    }

    protected get rootRoutePath(): string {
        return '/riskLimitLatest';
    }

}
