import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {COMPONENT_CSS, ErrorResponse, ValueGetter} from '@dbg-riskit/DAVe-UI-common';
import {OrderingCriteria} from '@dbg-riskit/DAVe-UI-datatable';
import {CSVExportColumn} from '@dbg-riskit/DAVe-UI-file';
import {DateFormatter} from '@dbg-riskit/DAVe-UI-view';

import {AccountMarginService} from './account.margin.service';
import {AccountMarginData} from './account.margin.types';

import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';

import {exportKeys, routingKeys, valueGetters} from './account.margin.latest.component';

@Component({
    moduleId   : module.id,
    templateUrl: 'account.margin.history.component.html',
    styleUrls  : ['../../' + COMPONENT_CSS]
})
export class AccountMarginHistoryComponent extends AbstractHistoryListComponent<AccountMarginData> {

    constructor(private accountMarginService: AccountMarginService,
        route: ActivatedRoute, dateFormatter: DateFormatter, numberPipe: DecimalPipe) {
        super(route, dateFormatter, numberPipe);
    }

    protected loadData(): void {
        this.accountMarginService.getAccountMarginHistory({
            clearer       : this.routeParams['clearer'],
            member        : this.routeParams['member'],
            account       : this.routeParams['account'],
            marginCurrency: this.routeParams['marginCurrency']
        }).subscribe(
            (rows: AccountMarginData[]) => {
                this.processData(rows);
            },
            (err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    protected getTickFromRecord(record: AccountMarginData): LineChartColumn[] {
        return [
            {
                type : 'date',
                value: record.received
            },
            {
                label: 'Margin requirement in margin currency',
                type : 'number',
                value: record.marginReqInMarginCurr
            },
            {
                label: 'Margin requirement in clearing currency',
                type : 'number',
                value: record.marginReqInClrCurr
            },
            {
                label: 'Unadjusted Margin',
                type : 'number',
                value: record.unadjustedMarginRequirement
            },
            {
                label: 'Variation Premium Payment',
                type : 'number',
                value: record.variationPremiumPayment
            }
        ];
    }

    public get defaultOrdering(): (OrderingCriteria<AccountMarginData> | ValueGetter<AccountMarginData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): CSVExportColumn<AccountMarginData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Account Margin History';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.ACCOUNT_MARGIN_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

const defaultOrdering: (OrderingCriteria<AccountMarginData> | ValueGetter<AccountMarginData>)[] = [
    {
        get       : valueGetters.received,
        descending: true
    }
];

//</editor-fold>
