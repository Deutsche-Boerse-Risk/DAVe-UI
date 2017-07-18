import {DecimalPipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '@dbg-riskit/dave-ui-common';
import {OrderingCriteria} from '@dbg-riskit/dave-ui-datatable';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {LiquiGroupSplitMarginService} from './liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData, LiquiGroupSplitMarginHistoryParams} from './liqui.group.split.margin.types';

import {AbstractHistoryListComponent} from '../list/abstract.history.list.component';

import {RoutePart} from '../list/bread.crumbs.component';

import {Subscription} from 'rxjs/Subscription';

export const routingKeys: (keyof LiquiGroupSplitMarginHistoryParams)[] = [
    'clearer',
    'member',
    'account',
    'liquidationGroup',
    'liquidationGroupSplit',
    'marginCurrency'
];

export abstract class AbstractLiquiGroupSplitMarginHistoryComponent
    extends AbstractHistoryListComponent<LiquiGroupSplitMarginData> {

    constructor(private liquiGroupSplitMarginService: LiquiGroupSplitMarginService,
        route: ActivatedRoute, dateFormatter: DateFormatter, numberPipe: DecimalPipe) {
        super(route, dateFormatter, numberPipe);
    }

    protected loadData(): Subscription {
        return this.liquiGroupSplitMarginService.getLiquiGroupSplitMarginHistory({
            clearer              : this.routeParams['clearer'],
            member               : this.routeParams['member'],
            account              : this.routeParams['account'],
            liquidationGroup     : this.routeParams['liquidationGroup'],
            liquidationGroupSplit: this.routeParams['liquidationGroupSplit'],
            marginCurrency       : this.routeParams['marginCurrency']
        }).subscribe(
            (rows: LiquiGroupSplitMarginData[]) => {
                this.processData(rows);
            }, (err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    protected createRoutePart(title: string, routePath: string, key: string, index: number): RoutePart {
        let part: RoutePart = super.createRoutePart(title, routePath, key, index);
        if (key === 'marginCurrency') {
            part.inactive = true;
        }
        return part;
    }

    public get defaultOrdering(): OrderingCriteria<LiquiGroupSplitMarginData>[] {
        return defaultOrdering;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

const defaultOrdering: OrderingCriteria<LiquiGroupSplitMarginData>[] = [
    {
        get       : (row: LiquiGroupSplitMarginData) => row.received,
        descending: true
    }
];

//</editor-fold>
