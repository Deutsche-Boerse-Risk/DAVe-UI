import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-devkit';
import {OrderingCriteria} from '@dbg-riskit/dave-ui-datatable';
import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {LiquiGroupMarginService} from './liqui.group.margin.service';
import {LiquiGroupMarginData, LiquiGroupMarginHistoryParams} from './liqui.group.margin.types';

import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';
import {RoutePart} from '../list/bread.crumbs.component';

import {exportKeys, valueGetters} from './liqui.group.margin.latest.component';

import {Subscription} from 'rxjs/Subscription';

export const routingKeys: (keyof LiquiGroupMarginHistoryParams)[] = [
    'clearer',
    'member',
    'account',
    'marginClass',
    'marginCurrency'
];

@Component({
    moduleId   : module.id,
    templateUrl: 'liqui.group.margin.history.component.html',
    styleUrls  : ['../../' + COMPONENT_CSS]
})
export class LiquiGroupMarginHistoryComponent extends AbstractHistoryListComponent<LiquiGroupMarginData> {

    constructor(private liquiGroupMarginService: LiquiGroupMarginService,
        route: ActivatedRoute, dateFormatter: DateFormatter, numberPipe: DecimalPipe) {
        super(route, dateFormatter, numberPipe);
    }

    protected loadData(): Subscription {
        return this.liquiGroupMarginService.getLiquiGroupMarginHistory({
            clearer       : this.routeParams['clearer'],
            member        : this.routeParams['member'],
            account       : this.routeParams['account'],
            marginClass   : this.routeParams['marginClass'],
            marginCurrency: this.routeParams['marginCurrency']
        }).subscribe(
            (rows: LiquiGroupMarginData[]) => {
                this.processData(rows);
            });
    }

    protected createRoutePart(title: string, routePath: string, key: string, index: number): RoutePart {
        let part: RoutePart = super.createRoutePart(title, routePath, key, index);
        if (key === 'marginCurrency') {
            part.inactive = true;
        }
        return part;
    }

    protected getTickFromRecord(record: LiquiGroupMarginData): LineChartColumn[] {
        return [
            {
                type : 'date',
                value: record.received
            },
            {
                label: 'Premium Margin',
                type : 'number',
                value: record.premiumMargin
            },
            {
                label: 'Current Liquidating Margin',
                type : 'number',
                value: record.currentLiquidatingMargin,
                prec : '.2-2'
            },
            {
                label: 'Initial Margin',
                type : 'number',
                value: record.additionalMargin
            },
            {
                label: 'Unadjusted Margin',
                type : 'number',
                value: record.unadjustedMarginRequirement
            },
            {
                label: 'Variation Premium Payment',
                type : 'number',
                value: record.variationPremiumPayment,
                prec : '.2-2'
            }
        ];
    }

    public get defaultOrdering(): OrderingCriteria<LiquiGroupMarginData>[] {
        return defaultOrdering;
    }

    public get exportKeys(): CSVExportColumn<LiquiGroupMarginData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Liquidation Group Margin History';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.LIQUI_GROUP_MARGIN_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

const defaultOrdering: OrderingCriteria<LiquiGroupMarginData>[] = [
    {
        get       : valueGetters.received,
        descending: true
    }
];

//</editor-fold>
