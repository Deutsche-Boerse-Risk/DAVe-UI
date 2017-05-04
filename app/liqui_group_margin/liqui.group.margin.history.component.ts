import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {LiquiGroupMarginService} from './liqui.group.margin.service';
import {LiquiGroupMarginData, LiquiGroupMarginHistoryParams} from './liqui.group.margin.types';

import {DateFormatter} from '../common/common.module';
import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';
import {RoutePart} from '../list/bread.crumbs.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria} from '../datatable/data.table.column.directive';

import {exportKeys, valueGetters} from './liqui.group.margin.latest.component';

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
    styleUrls  : ['../component.css']
})
export class LiquiGroupMarginHistoryComponent extends AbstractHistoryListComponent<LiquiGroupMarginData> {

    constructor(private liquiGroupMarginService: LiquiGroupMarginService,
        route: ActivatedRoute, dateFormatter: DateFormatter, numberPipe: DecimalPipe) {
        super(route, dateFormatter, numberPipe);
    }

    protected loadData(): void {
        this.liquiGroupMarginService.getLiquiGroupMarginHistory({
            clearer       : this.routeParams['clearer'],
            member        : this.routeParams['member'],
            account       : this.routeParams['account'],
            marginClass   : this.routeParams['marginClass'],
            marginCurrency: this.routeParams['marginCurrency']
        }).subscribe(
            (rows: LiquiGroupMarginData[]) => {
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
                value: record.currentLiquidatingMargin
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
                label: 'Variation / Premium Cash Flow',
                type : 'number',
                value: record.variationPremiumPayment
            }
        ];
    }

    public get defaultOrdering(): OrderingCriteria<LiquiGroupMarginData>[] {
        return defaultOrdering;
    }

    public get exportKeys(): ExportColumn<LiquiGroupMarginData>[] {
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
