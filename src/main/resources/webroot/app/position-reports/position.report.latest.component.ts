import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {AbstractListComponent} from '../abstract.list.component';
import {PositionReportsService} from './position.reports.service';
import {ErrorResponse} from '../abstract.http.service';
import {PositionReportRow} from './position.report.types';

const routingKeys: string[] = ['clearer', 'member', 'account', 'class', 'symbol', 'putCall',
    'strikePrice', 'optAttribute', 'maturityMonthYear'];

const exportKeys: string[] = ['clearer', 'member', 'account', 'bizDt', 'symbol', 'putCall', 'maturityMonthYear',
    'strikePriceFloat', 'optAttribute', 'crossMarginLongQty', 'crossMarginShortQty', 'optionExcerciseQty',
    'optionAssignmentQty', 'allocationTradeQty', 'deliveryNoticeQty', 'clearingCcy', 'mVar', 'compVar',
    'compCorrelationBreak', 'compCompressionError', 'compLiquidityAddOn', 'compLongOptionCredit', 'productCcy',
    'variationMarginPremiumPayment', 'premiumMargin', 'delta', 'gamma', 'vega', 'rho', 'theta', 'received', 'clss',
    'underlying', 'netLS', 'netEA'
];

@Component({
    moduleId: module.id,
    templateUrl: 'position.report.latest.component.html',
    styleUrls: ['position.report.latest.component.css']
})
export class PositionReportLatestComponent extends AbstractListComponent {

    constructor(private positionReportsService: PositionReportsService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.positionReportsService.getPositionReportLatest(this.routeParams['clearer'], this.routeParams['member'],
            this.routeParams['account'], this.routeParams['class'], this.routeParams['symbol'],
            this.routeParams['putCall'], this.routeParams['strikePrice'], this.routeParams['optAttribute'],
            this.routeParams['maturityMonthYear'])
            .then(this.processData.bind(this))
            .catch((err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    private processData(chartData: PositionReportRow[]): void {
        delete this.errorMessage;
        this.initialLoad = false;
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