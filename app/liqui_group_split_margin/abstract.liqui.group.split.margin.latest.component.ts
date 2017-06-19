import {ActivatedRoute} from '@angular/router';

import {ErrorResponse, ValueGetter} from '@dbg-riskit/dave-ui-common';
import {OrderingCriteria} from '@dbg-riskit/dave-ui-datatable';

import {LiquiGroupSplitMarginService} from './liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData, LiquiGroupSplitMarginParams} from './liqui.group.split.margin.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';
import {RoutePart} from '../list/bread.crumbs.component';

export const routingKeys: (keyof LiquiGroupSplitMarginParams)[] = [
    'clearer',
    'member',
    'account',
    'liquidationGroup',
    'liquidationGroupSplit'
];

export abstract class AbstractLiquiGroupSplitMarginLatestComponent
    extends AbstractLatestListComponent<LiquiGroupSplitMarginData> {

    constructor(private liquiGroupSplitMarginService: LiquiGroupSplitMarginService,
        route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.liquiGroupSplitMarginService.getLiquiGroupSplitMarginLatest({
            clearer              : this.routeParams['clearer'],
            member               : this.routeParams['member'],
            account              : this.routeParams['account'],
            liquidationGroup     : this.routeParams['liquidationGroup'],
            liquidationGroupSplit: this.routeParams['liquidationGroupSplit']
        }).subscribe(
            (rows: LiquiGroupSplitMarginData[]) => {
                this.processData(rows);
            },
            (err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    protected createRoutePart(title: string, routePath: string, key: string, index: number): RoutePart {
        let part: RoutePart = super.createRoutePart(title, routePath, key, index);
        if (key === 'liquidationGroupSplit') {
            part.inactive = true;
        }
        return part;
    }

    public get defaultOrdering(): (
        OrderingCriteria<LiquiGroupSplitMarginData>
        | ValueGetter<LiquiGroupSplitMarginData>)[] {
        return defaultOrdering;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

const defaultOrdering: (
    OrderingCriteria<LiquiGroupSplitMarginData> | ValueGetter<LiquiGroupSplitMarginData>)[] = [
    (row: LiquiGroupSplitMarginData) => row.clearer,
    (row: LiquiGroupSplitMarginData) => row.member,
    (row: LiquiGroupSplitMarginData) => row.account,
    (row: LiquiGroupSplitMarginData) => row.liquidationGroup,
    (row: LiquiGroupSplitMarginData) => row.liquidationGroupSplit
];

//</editor-fold>