import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {TotalMarginService} from './total.margin.service';
import {TotalMarginData} from './total.margin.types';

import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';

import {exportKeys, routingKeys} from './total.margin.requirement.latest.component';

const defaultOrdering = ['-received'];

@Component({
    moduleId: module.id,
    templateUrl: 'total.margin.requirement.history.component.html',
    styleUrls: ['../common.component.css']
})
export class TotalMarginRequirementHistoryComponent extends AbstractHistoryListComponent<TotalMarginData> {

    constructor(private totalMarginService: TotalMarginService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.totalMarginService.getTotalMarginHistory(this.routeParams['clearer'], this.routeParams['pool'],
            this.routeParams['member'], this.routeParams['account'], this.routeParams['ccy'])
            .subscribe(
                (rows: TotalMarginData[]) => {
                    this.processData(rows);
                },
                (err: ErrorResponse) => {
                    this.errorMessage = 'Server returned status ' + err.status;
                    this.initialLoad = false;
                });
    }


    protected getTickFromRecord(record: TotalMarginData): LineChartColumn[] {
        return [
            {
                type: 'date',
                value: record.received
            },
            {
                label: 'Adjusted Marign',
                type: 'number',
                value: record.adjustedMargin,
            },
            {
                label: 'Unadjusted Margin',
                type: 'number',
                value: record.unadjustedMargin,
            }
        ]
    }

    public get defaultOrdering(): string[] {
        return defaultOrdering;
    }

    public get exportKeys(): string[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Total Margin Requirement History';
    }

    protected get rootRoutePath(): string {
        return '/totalMarginRequirementLatest';
    }

}
