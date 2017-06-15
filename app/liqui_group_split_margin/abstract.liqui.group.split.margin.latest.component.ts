import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {LiquiGroupSplitMarginService} from './liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData, LiquiGroupSplitMarginParams} from './liqui.group.split.margin.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';

export const routingKeys: (keyof LiquiGroupSplitMarginParams)[] = [
    'clearer',
    'member',
    'account',
    'liquidationGroup'
];

export abstract class AbstractLiquiGroupSplitMarginLatestComponent
    extends AbstractLatestListComponent<LiquiGroupSplitMarginData> {

    constructor(private liquiGroupSplitMarginService: LiquiGroupSplitMarginService,
        route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.liquiGroupSplitMarginService.getLiquiGroupSplitMarginLatest({
            clearer         : this.routeParams['clearer'],
            member          : this.routeParams['member'],
            account         : this.routeParams['account'],
            liquidationGroup: this.routeParams['liquidationGroup']
        }).subscribe(
            (rows: LiquiGroupSplitMarginData[]) => {
                this.processData(rows);
            },
            (err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    public get defaultOrdering(): (
        OrderingCriteria<LiquiGroupSplitMarginData>
        | OrderingValueGetter<LiquiGroupSplitMarginData>)[] {
        return defaultOrdering;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

const defaultOrdering: (
    OrderingCriteria<LiquiGroupSplitMarginData> | OrderingValueGetter<LiquiGroupSplitMarginData>)[] = [
    (row: LiquiGroupSplitMarginData) => row.clearer,
    (row: LiquiGroupSplitMarginData) => row.member,
    (row: LiquiGroupSplitMarginData) => row.account,
    (row: LiquiGroupSplitMarginData) => row.liquidationGroup,
    (row: LiquiGroupSplitMarginData) => row.liquidationGroupSplit
];

//</editor-fold>