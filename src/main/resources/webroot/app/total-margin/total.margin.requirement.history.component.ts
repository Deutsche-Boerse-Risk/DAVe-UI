import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {DATE_PIPE} from '../common/common.module';

import {ErrorResponse} from '../abstract.http.service';
import {TotalMarginService} from './total.margin.service';
import {TotalMarginData} from './total.margin.types';

import {AbstractHistoryListComponent} from '../abstract.history.list.component';

import {exportKeys, routingKeys} from './total.margin.requirement.latest.component';

const defaultOrdering = ['-received'];

@Component({
    moduleId: module.id,
    templateUrl: 'total.margin.requirement.history.component.html',
    styleUrls: ['total.margin.requirement.component.css']
})
export class TotalMarginRequirementHistoryComponent extends AbstractHistoryListComponent<TotalMarginData> {

    constructor(private totalMarginService: TotalMarginService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.totalMarginService.getTotalMarginHistory(this.routeParams['clearer'], this.routeParams['pool'],
            this.routeParams['member'], this.routeParams['account'], this.routeParams['ccy'])
            .then((rows: TotalMarginData[]) => {
                this.processData(rows);
            })
            .catch((err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }


    protected getTickFromRecord(record: TotalMarginData): any {
        let tick = {
            period: DATE_PIPE.transform(record.received, 'yyyy-MM-dd HH:mm:ss'),
            adjustedMargin: record.adjustedMargin,
            unadjustedMargin: record.unadjustedMargin
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
        return 'Total Margin Requirement';
    }

    protected get rootRoutePath(): string {
        return '/totalMarginRequirementLatest';
    }

}
