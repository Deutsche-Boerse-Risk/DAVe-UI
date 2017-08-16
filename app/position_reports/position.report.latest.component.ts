import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {COMPONENT_CSS, ValueGetter} from '@dbg-riskit/dave-ui-common';
import {OrderingCriteria} from '@dbg-riskit/dave-ui-datatable';
import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {PositionReportData, PositionReportsParams} from './position.report.types';
import {PositionReportsService} from './position.reports.service';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';

import {Subscription} from 'rxjs/Subscription';

export const routingKeys: (keyof PositionReportsParams)[] = [
    'clearer',
    'member',
    'account',
    'underlying',
    'liquidationGroup',
    'liquidationGroupSplit',
    'product',
    'callPut',
    'contractYear',
    'contractMonth',
    'expiryDay',
    'exercisePrice',
    'version',
    'flexContractSymbol'
];

@Component({
    moduleId   : module.id,
    templateUrl: 'position.report.latest.component.html',
    styleUrls  : ['../../' + COMPONENT_CSS]
})
export class PositionReportLatestComponent extends AbstractLatestListComponent<PositionReportData> {

    constructor(private positionReportsService: PositionReportsService, route: ActivatedRoute,
        dateFormatter: DateFormatter, numberFormatter: DecimalPipe) {
        super(route, dateFormatter, numberFormatter);
    }

    protected loadData(): Subscription {
        return this.positionReportsService.getPositionReportLatest({
            clearer              : this.routeParams['clearer'],
            member               : this.routeParams['member'],
            account              : this.routeParams['account'],
            underlying           : this.routeParams['underlying'],
            liquidationGroup     : this.routeParams['liquidationGroup'],
            liquidationGroupSplit: this.routeParams['liquidationGroupSplit'],
            product              : this.routeParams['product'],
            callPut              : this.routeParams['callPut'],
            contractYear         : this.routeParams['contractYear'],
            contractMonth        : this.routeParams['contractMonth'],
            expiryDay            : this.routeParams['expiryDay'],
            exercisePrice        : this.routeParams['exercisePrice'],
            version              : this.routeParams['version'],
            flexContractSymbol   : this.routeParams['flexContractSymbol']
        }).subscribe(
            (rows: PositionReportData[]) => {
                this.processData(rows);
            });
    }

    public get defaultOrdering(): (OrderingCriteria<PositionReportData> | ValueGetter<PositionReportData>)[] {
        return defaultOrdering;
    }

    public get exportKeys(): CSVExportColumn<PositionReportData>[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    public get rootRouteTitle(): string {
        return 'Latest Position Reports';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.POSITION_REPORTS_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

export const valueGetters = {
    clearer           : (row: PositionReportData) => row.clearer,
    member            : (row: PositionReportData) => row.member,
    account           : (row: PositionReportData) => row.account,
    product           : (row: PositionReportData) => row.product,
    callPut           : (row: PositionReportData) => row.callPut,
    exercisePrice     : (row: PositionReportData) => row.exercisePrice,
    version           : (row: PositionReportData) => row.version,
    contractYear      : (row: PositionReportData) => row.contractYear,
    contractMonth     : (row: PositionReportData) => row.contractMonth,
    expiryDay         : (row: PositionReportData) => row.expiryDay,
    netQuantityLs     : (row: PositionReportData) => row.netQuantityLs,
    compVar           : (row: PositionReportData) => row.compVar,
    normalizedDelta   : (row: PositionReportData) => row.normalizedDelta,
    compLiquidityAddOn: (row: PositionReportData) => row.compLiquidityAddOn,
    received          : (row: PositionReportData) => row.received,
    contractDate      : (row: PositionReportData) => row.contractDate
};

const defaultOrdering: (OrderingCriteria<PositionReportData> | ValueGetter<PositionReportData>)[] = [
    {
        get       : (row: PositionReportData) => Math.abs(row.compVar),
        descending: true
    },
    valueGetters.clearer,
    valueGetters.member,
    valueGetters.account,
    valueGetters.product,
    valueGetters.callPut,
    valueGetters.exercisePrice,
    valueGetters.version,
    valueGetters.contractYear,
    valueGetters.contractMonth,
    valueGetters.expiryDay
];

export const exportKeys: CSVExportColumn<PositionReportData>[] = [
    {
        get   : valueGetters.clearer,
        header: 'Clearer'
    },
    {
        get   : valueGetters.member,
        header: 'Member / Client'
    },
    {
        get   : valueGetters.account,
        header: 'Account'
    },
    {
        get   : (row: PositionReportData) => row.businessDate,
        header: 'Business date'
    },
    {
        get   : (row: PositionReportData) => row.underlying,
        header: 'Underlying'
    },
    {
        get   : valueGetters.product,
        header: 'Product ID'
    },
    {
        get   : valueGetters.callPut,
        header: 'P/C'
    },
    {
        get   : valueGetters.exercisePrice,
        header: 'Exercise price'
    },
    {
        get   : valueGetters.version,
        header: 'Version'
    },
    {
        get   : (row: PositionReportData) => row.contractMonth + '/' + row.contractYear,
        header: 'Maturity'
    },
    {
        get   : valueGetters.netQuantityLs,
        header: 'Net position'
    },
    {
        get   : valueGetters.compVar,
        header: 'Position VaR'
    },
    {
        get   : valueGetters.normalizedDelta,
        header: 'EuroDelta'
    },
    {
        get   : (row: PositionReportData) => row.flexContractSymbol,
        header: 'Flex contract symbol'
    },
    {
        get   : (row: PositionReportData) => row.liquidationGroup,
        header: 'Liquidation group'
    },
    {
        get   : (row: PositionReportData) => row.liquidationGroupSplit,
        header: 'Liquidation group split'
    },
    {
        get   : (row: PositionReportData) => row.clearingCurrency,
        header: 'Clearing Ccy'
    },
    {
        get   : (row: PositionReportData) => row.productCurrency,
        header: 'Product Ccy'
    },
    {
        get   : (row: PositionReportData) => row.netQuantityEa,
        header: 'NetEA'
    },
    {
        get   : (row: PositionReportData) => row.compCorrelationBreak,
        header: 'CorrBreak'
    },
    {
        get   : (row: PositionReportData) => row.compCompressionError,
        header: 'CompError'
    },
    {
        get   : (row: PositionReportData) => row.compLongOptionCredit,
        header: 'LonOptCredit'
    },
    {
        get   : valueGetters.compLiquidityAddOn,
        header: 'CompLiquidityAddOn'
    },
    {
        get   : (row: PositionReportData) => row.variationPremiumPayment,
        header: 'PremPay'
    },
    {
        get   : (row: PositionReportData) => row.premiumMargin,
        header: 'PremMrgn'
    },
    {
        get   : (row: PositionReportData) => row.normalizedGamma,
        header: 'Gamma'
    },
    {
        get   : (row: PositionReportData) => row.normalizedVega,
        header: 'Vega'
    },
    {
        get   : (row: PositionReportData) => row.normalizedRho,
        header: 'Rho'
    },
    {
        get   : (row: PositionReportData) => row.normalizedTheta,
        header: 'Theta'
    },
    {
        get   : (row: PositionReportData) => row.mVar,
        header: 'MVar'
    },
    {
        get   : valueGetters.received,
        header: 'Last update'
    }
];

//</editor-fold>