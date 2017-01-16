import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../http.service';

import {PositionReportData} from './position.report.types';
import {PositionReportsService} from './position.reports.service';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';
import {ExportColumn} from '../list/download.menu.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';

export const routingKeys: string[] = ['clearer', 'member', 'account', 'class', 'symbol', 'putCall',
    'strikePrice', 'optAttribute', 'maturityMonthYear'];

@Component({
    moduleId: module.id,
    templateUrl: 'position.report.latest.component.html',
    styleUrls: ['../common.component.css']
})
export class PositionReportLatestComponent extends AbstractLatestListComponent<PositionReportData> {

    constructor(private positionReportsService: PositionReportsService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.positionReportsService.getPositionReportLatest(this.routeParams['clearer'], this.routeParams['member'],
            this.routeParams['account'], this.routeParams['class'], this.routeParams['symbol'],
            this.routeParams['putCall'], this.routeParams['strikePrice'], this.routeParams['optAttribute'],
            this.routeParams['maturityMonthYear'])
            .subscribe(
                (rows: PositionReportData[]) => {
                    this.processData(rows);
                },
                (err: ErrorResponse) => {
                    this.errorMessage = 'Server returned status ' + err.status;
                    this.initialLoad = false;
                });
    }

    public get defaultOrdering(): (OrderingCriteria<PositionReportData> | OrderingValueGetter<PositionReportData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): ExportColumn<PositionReportData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Latest Position Reports';
    }

    protected get rootRoutePath(): string {
        return '/positionReportLatest';
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

export const valueGetters = {
    clearer: (row: PositionReportData) => {
        return row.clearer;
    },
    member: (row: PositionReportData) => {
        return row.member;
    },
    account: (row: PositionReportData) => {
        return row.account;
    },
    symbol: (row: PositionReportData) => {
        return row.symbol;
    },
    putCall: (row: PositionReportData) => {
        return row.putCall;
    },
    strikePrice: (row: PositionReportData) => {
        return row.strikePrice;
    },
    optAttribute: (row: PositionReportData) => {
        return row.optAttribute;
    },
    maturityMonthYear: (row: PositionReportData) => {
        return row.maturityMonthYear
    },
    netLS: (row: PositionReportData) => {
        return row.netLS;
    },
    compVar: (row: PositionReportData) => {
        return row.compVar;
    },
    delta: (row: PositionReportData) => {
        return row.delta;
    },
    compLiquidityAddOn: (row: PositionReportData) => {
        return row.compLiquidityAddOn;
    },
    received: (row: PositionReportData) => {
        return row.received;
    }
};

const defaultOrdering: (OrderingCriteria<PositionReportData> | OrderingValueGetter<PositionReportData>)[] = [
    {
        get: (row: PositionReportData) => {
            return Math.abs(row.compVar);
        },
        descending: true
    },
    valueGetters.clearer,
    valueGetters.member,
    valueGetters.account,
    valueGetters.symbol,
    valueGetters.putCall,
    valueGetters.strikePrice,
    valueGetters.optAttribute,
    valueGetters.maturityMonthYear
];

export const exportKeys: ExportColumn<PositionReportData>[] = [
    {
        get: valueGetters.clearer,
        header: 'Clearer'
    },
    {
        get: valueGetters.member,
        header: 'Member / Client'
    },
    {
        get: valueGetters.account,
        header: 'Account'
    },
    {
        get: (row: PositionReportData) => {
            return row.bizDt;
        },
        header: 'BizDt'
    },
    {
        get: valueGetters.symbol,
        header: 'Symbol'
    },
    {
        get: valueGetters.putCall,
        header: 'P/C'
    },
    {
        get: valueGetters.maturityMonthYear,
        header: 'MMY'
    },
    {
        get: valueGetters.strikePrice,
        header: 'Strk'
    },
    {
        get: valueGetters.optAttribute,
        header: 'Opt'
    },
    {
        get: (row: PositionReportData) => {
            return row.crossMarginLongQty;
        },
        header: 'CrMrgLQty'
    },
    {
        get: (row: PositionReportData) => {
            return row.crossMarginShortQty;
        },
        header: 'CrMrgSQty'
    },
    {
        get: (row: PositionReportData) => {
            return row.optionExcerciseQty;
        },
        header: 'OptExcQty'
    },
    {
        get: (row: PositionReportData) => {
            return row.optionAssignmentQty;
        },
        header: 'OptAssQty'
    },
    {
        get: (row: PositionReportData) => {
            return row.allocationTradeQty;
        },
        header: 'AllTrQty'
    },
    {
        get: (row: PositionReportData) => {
            return row.deliveryNoticeQty;
        },
        header: 'DelNtQty'
    },
    {
        get: (row: PositionReportData) => {
            return row.clearingCcy;
        },
        header: 'Clearing Ccy'
    },
    {
        get: (row: PositionReportData) => {
            return row.mVar;
        },
        header: 'MVar'
    },
    {
        get: valueGetters.compVar,
        header: 'Position VaR'
    },
    {
        get: (row: PositionReportData) => {
            return row.compCorrelationBreak;
        },
        header: 'CorrBreak'
    },
    {
        get: (row: PositionReportData) => {
            return row.compCompressionError;
        },
        header: 'CopmError'
    },
    {
        get: valueGetters.compLiquidityAddOn,
        header: 'LA'
    },
    {
        get: (row: PositionReportData) => {
            return row.compLongOptionCredit;
        },
        header: 'LonOptCredit'
    },
    {
        get: (row: PositionReportData) => {
            return row.productCcy;
        },
        header: 'Product Ccy'
    },
    {
        get: (row: PositionReportData) => {
            return row.variationMarginPremiumPayment;
        },
        header: 'PremPay'
    },
    {
        get: (row: PositionReportData) => {
            return row.premiumMargin;
        },
        header: 'PremMrgn'
    },
    {
        get: valueGetters.delta,
        header: 'EuroDelta'
    },
    {
        get: (row: PositionReportData) => {
            return row.gamma;
        },
        header: 'Gamma'
    },
    {
        get: (row: PositionReportData) => {
            return row.vega;
        },
        header: 'Vega'
    },
    {
        get: (row: PositionReportData) => {
            return row.rho;
        },
        header: 'Rho'
    },
    {
        get: (row: PositionReportData) => {
            return row.theta;
        },
        header: 'Theta'
    },
    {
        get: valueGetters.received,
        header: 'Last update'
    },
    {
        get: (row: PositionReportData) => {
            return row.class;
        },
        header: 'Liqui Group / Margin Class'
    },
    {
        get: (row: PositionReportData) => {
            return row.underlying;
        },
        header: 'Underlying'
    },
    {
        get: valueGetters.netLS,
        header: 'NetLS'
    },
    {
        get: (row: PositionReportData) => {
            return row.netEA;
        },
        header: 'NetEA'
    }
];

//</editor-fold>