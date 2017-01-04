import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {DataTable, DataTableHeader} from '../common/datatable/data.table.types';
import {NUMBER_PIPE} from '../common/common.module';

import {ErrorResponse} from '../abstract.http.service';
import {PositionReportRow} from './position.report.types';
import {PositionReportsService} from './position.reports.service';

import {AbstractListComponent} from '../abstract.list.component';

const routingKeys: string[] = ['clearer', 'member', 'account', 'class', 'symbol', 'putCall',
    'strikePrice', 'optAttribute', 'maturityMonthYear'];

const exportKeys: string[] = ['clearer', 'member', 'account', 'bizDt', 'symbol', 'putCall', 'maturityMonthYear',
    'strikePriceFloat', 'optAttribute', 'crossMarginLongQty', 'crossMarginShortQty', 'optionExcerciseQty',
    'optionAssignmentQty', 'allocationTradeQty', 'deliveryNoticeQty', 'clearingCcy', 'mVar', 'compVar',
    'compCorrelationBreak', 'compCompressionError', 'compLiquidityAddOn', 'compLongOptionCredit', 'productCcy',
    'variationMarginPremiumPayment', 'premiumMargin', 'delta', 'gamma', 'vega', 'rho', 'theta', 'received', 'clss',
    'underlying', 'netLS', 'netEA'
];

const defaultOrdering = ['-absCompVar', 'clearer', 'member', 'account', 'symbol', 'putCall', 'strikePriceFloat',
    'optAttribute', 'maturityMonthYear'];

const tableHeader: DataTableHeader = [
    {
        title: 'Member / Client',
        sortingKey: 'member'
    },
    {
        title: 'Account',
        sortingKey: 'account'
    },
    {
        title: 'Symbol',
        tooltip: 'Product symbol',
        sortingKey: 'symbol'
    },
    {
        title: 'P/C',
        tooltip: 'Put / Call flag (Options only)',
        sortingKey: 'putCall'
    },
    {
        title: 'Strk',
        tooltip: 'Strike (exercise) price (Options only)',
        sortingKey: 'strikePriceFloat'
    },
    {
        title: 'Opt',
        tooltip: 'Version number (Options only)',
        sortingKey: 'optAttribute'
    },
    {
        title: 'MMY',
        tooltip: 'Maturity month and year',
        sortingKey: 'maturityMonthYear'
    },
    {
        title: 'NetLS',
        tooltip: 'Net position',
        sortingKey: 'netLS'
    },
    {
        title: 'Position VaR',
        tooltip: 'PnL of the position when calculating portfolio VaR',
        sortingKey: 'compVar'
    },
    {
        title: 'EuroDelta',
        tooltip: 'Position sensibility to underlying move in Euro',
        sortingKey: 'delta'
    },
    {
        title: 'LA',
        tooltip: 'Liquidity Addon of the position',
        sortingKey: 'compLiquidityAddOn'
    }
];

const rootRouteLink = ['/positionReportLatest', '{{clearer}}', '{{member}}'];
const accountRouteLink = rootRouteLink.concat(['{{account}}']);
const symbolRouteLink = accountRouteLink.concat(['{{clss}}', '{{symbol}}']);
const putCallRouteLink = symbolRouteLink.concat(['{{putCall}}']);
const strikePriceRouteLink = putCallRouteLink.concat(['{{strikePrice}}']);
const optAttributeRouteLink = strikePriceRouteLink.concat(['{{optAttribute}}']);
const maturityMonthYearRouteLink = optAttributeRouteLink.concat(['{{maturityMonthYear}}']);

@Component({
    moduleId: module.id,
    templateUrl: 'position.report.latest.component.html',
    styleUrls: ['position.report.latest.component.css']
})
export class PositionReportLatestComponent extends AbstractListComponent<PositionReportRow> {

    public dataTable: DataTable<PositionReportRow> = {
        header: tableHeader,
        rows: {
            cells: [
                {
                    titleKey: 'member',
                    routerLink: rootRouteLink
                },
                {
                    titleKey: 'account',
                    routerLink: accountRouteLink
                },
                {
                    titleKey: 'symbol',
                    routerLink: symbolRouteLink
                },
                {
                    titleKey: 'putCall',
                    routerLink: putCallRouteLink
                },
                {
                    titleKey: 'strikePriceFloat',
                    pipe: NUMBER_PIPE,
                    pipeArgs: '.2-2',
                    routerLink: strikePriceRouteLink
                },
                {
                    titleKey: 'optAttribute',
                    routerLink: optAttributeRouteLink
                },
                {
                    titleKey: 'maturityMonthYear',
                    routerLink: maturityMonthYearRouteLink
                },
                {
                    titleKey: 'netLS',
                    pipe: NUMBER_PIPE,
                    pipeArgs: '.2-2'
                },
                {
                    titleKey: 'compVar',
                    pipe: NUMBER_PIPE,
                    pipeArgs: '.2-2'
                },
                {
                    titleKey: 'delta',
                    pipe: NUMBER_PIPE,
                    pipeArgs: '.2-2'
                },
                {
                    titleKey: 'compLiquidityAddOn',
                    pipe: NUMBER_PIPE,
                    pipeArgs: '.2-2'
                }
            ],
            data: []
        },
        defaultOrdering: defaultOrdering,
        pageSize: 20
    };

    constructor(private positionReportsService: PositionReportsService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.positionReportsService.getPositionReportLatest(this.routeParams['clearer'], this.routeParams['member'],
            this.routeParams['account'], this.routeParams['class'], this.routeParams['symbol'],
            this.routeParams['putCall'], this.routeParams['strikePrice'], this.routeParams['optAttribute'],
            this.routeParams['maturityMonthYear'])
            .then((rows: PositionReportRow[]) => {
                this.processData(rows);
            })
            .catch((err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    protected processRecord(record: PositionReportRow): void {
        record.netLS = record.crossMarginLongQty - record.crossMarginShortQty;
        record.netEA = (record.optionExcerciseQty - record.optionAssignmentQty) + (record.allocationTradeQty - record.deliveryNoticeQty);
        record.absCompVar = Math.abs(record.compVar);

        if (record.strikePrice) {
            record.strikePriceFloat = parseFloat(record.strikePrice);
        }
        this.dataTable.rows.data.push(record);
    }

    protected get exportKeys(): string[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    protected get rootRouteTitle(): string {
        return 'Latest Position Reports';
    }

    protected get rootRoutePath(): string {
        return '/positionReportLatest';
    }

}