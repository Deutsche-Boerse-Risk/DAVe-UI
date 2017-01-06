import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {DATE_PIPE} from '../common/common.module';

import {ErrorResponse} from '../abstract.http.service';
import {PositionReportData} from './position.report.types';
import {PositionReportsService} from './position.reports.service';

import {AbstractHistoryListComponent} from '../abstract.history.list.component';

import {exportKeys, routingKeys} from './position.report.latest.component';

const defaultOrdering = ['-received'];

@Component({
    moduleId: module.id,
    templateUrl: 'position.report.history.component.html',
    styleUrls: ['position.report.component.css']
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
            .then((rows: PositionReportData[]) => {
                this.processData(rows);
            })
            .catch((err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }


    protected getTickFromRecord(record: PositionReportData): any {
        let tick = {
            period: DATE_PIPE.transform(record.received, 'yyyy-MM-dd HH:mm:ss'),
            netLS: record.netLS,
            netEA: record.netEA,
            mVar: record.mVar,
            compVar: record.compVar,
            delta: record.delta,
            compLiquidityAddOn: record.compLiquidityAddOn
        };
        return tick;
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
        return 'Position Report History';
    }

    protected get rootRoutePath(): string {
        return '/positionReportLatest';
    }

}