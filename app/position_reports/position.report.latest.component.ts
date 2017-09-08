import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ValueGetter} from '@dbg-riskit/dave-ui-common';
import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-devkit';
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

    public get filterValueGetters(): ValueGetter<PositionReportData>[] {
        return filterValueGetters;
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
    clearer                : (row: PositionReportData) => row.clearer,
    member                 : (row: PositionReportData) => row.member,
    account                : (row: PositionReportData) => row.account,
    product                : (row: PositionReportData) => row.product,
    callPut                : (row: PositionReportData) => row.callPut,
    exercisePrice          : (row: PositionReportData) => row.exercisePrice,
    version                : (row: PositionReportData) => row.version,
    contractYear           : (row: PositionReportData) => row.contractYear,
    contractMonth          : (row: PositionReportData) => row.contractMonth,
    expiryDay              : (row: PositionReportData) => row.expiryDay,
    netQuantityLs          : (row: PositionReportData) => row.netQuantityLs,
    compVar                : (row: PositionReportData) => row.compVar,
    normalizedDelta        : (row: PositionReportData) => row.normalizedDelta,
    compLiquidityAddOn     : (row: PositionReportData) => row.compLiquidityAddOn,
    received               : (row: PositionReportData) => row.received,
    contractDate           : (row: PositionReportData) => row.contractDate,
    underlying             : (row: PositionReportData) => row.underlying,
    clearingCurrency       : (row: PositionReportData) => row.clearingCurrency,
    productCurrency        : (row: PositionReportData) => row.productCurrency,
    liquidationGroup       : (row: PositionReportData) => row.liquidationGroup,
    liquidationGroupSplit  : (row: PositionReportData) => row.liquidationGroupSplit,
    netQuantityEa          : (row: PositionReportData) => row.netQuantityEa,
    compCorrelationBreak   : (row: PositionReportData) => row.compCorrelationBreak,
    compCompressionError   : (row: PositionReportData) => row.compCompressionError,
    compLongOptionCredit   : (row: PositionReportData) => row.compLongOptionCredit,
    variationPremiumPayment: (row: PositionReportData) => row.variationPremiumPayment,
    premiumMargin          : (row: PositionReportData) => row.premiumMargin,
    normalizedGamma        : (row: PositionReportData) => row.normalizedGamma,
    normalizedVega         : (row: PositionReportData) => row.normalizedVega,
    normalizedRho          : (row: PositionReportData) => row.normalizedRho,
    normalizedTheta        : (row: PositionReportData) => row.normalizedTheta,
    mVar                   : (row: PositionReportData) => row.mVar
};

export const filterValueGetters = [
    valueGetters.member,
    valueGetters.account,
    valueGetters.underlying,
    valueGetters.clearingCurrency,
    valueGetters.productCurrency,
    () => 'EUR',
    valueGetters.product,
    valueGetters.callPut,
    valueGetters.contractDate,
    valueGetters.exercisePrice,
    valueGetters.version,
    valueGetters.netQuantityLs,
    valueGetters.compVar,
    valueGetters.normalizedDelta,
    valueGetters.compLiquidityAddOn,
    valueGetters.liquidationGroup,
    valueGetters.liquidationGroupSplit,
    valueGetters.netQuantityEa,
    valueGetters.compCorrelationBreak,
    valueGetters.compCompressionError,
    valueGetters.compLongOptionCredit,
    valueGetters.variationPremiumPayment,
    valueGetters.premiumMargin,
    valueGetters.normalizedGamma,
    valueGetters.normalizedVega,
    valueGetters.normalizedRho,
    valueGetters.normalizedTheta,
    valueGetters.mVar
];

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
        get   : valueGetters.underlying,
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
        header: 'Strike'
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
        header: 'EUR Delta'
    },
    {
        get   : valueGetters.compLiquidityAddOn,
        header: 'LA'
    },
    {
        get   : valueGetters.liquidationGroup,
        header: 'Liquidation group'
    },
    {
        get   : valueGetters.liquidationGroupSplit,
        header: 'Liquidation group split'
    },
    {
        get   : (row: PositionReportData) => row.flexContractSymbol,
        header: 'Flex contract symbol'
    },
    {
        get   : valueGetters.clearingCurrency,
        header: 'Clearing Ccy'
    },
    {
        get   : valueGetters.productCurrency,
        header: 'Product Ccy'
    },
    {
        get   : valueGetters.netQuantityEa,
        header: 'NetEA'
    },
    {
        get   : valueGetters.compCorrelationBreak,
        header: 'CorrBreak'
    },
    {
        get   : valueGetters.compCompressionError,
        header: 'CompError'
    },
    {
        get   : valueGetters.compLongOptionCredit,
        header: 'LonOptCredit'
    },
    {
        get   : valueGetters.variationPremiumPayment,
        header: 'PremPay'
    },
    {
        get   : valueGetters.premiumMargin,
        header: 'Premium Margin'
    },
    {
        get   : valueGetters.normalizedGamma,
        header: 'EUR Gamma'
    },
    {
        get   : valueGetters.normalizedVega,
        header: 'EUR Vega'
    },
    {
        get   : valueGetters.normalizedRho,
        header: 'EUR Rho'
    },
    {
        get   : valueGetters.normalizedTheta,
        header: 'EUR Theta'
    },
    {
        get   : valueGetters.mVar,
        header: 'MVar'
    },
    {
        get   : valueGetters.received,
        header: 'Last update'
    }
];

//</editor-fold>