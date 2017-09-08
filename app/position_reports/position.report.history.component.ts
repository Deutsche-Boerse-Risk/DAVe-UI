import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ValueGetter} from '@dbg-riskit/dave-ui-common';
import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-devkit';
import {OrderingCriteria} from '@dbg-riskit/dave-ui-datatable';
import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {PositionReportData} from './position.report.types';
import {PositionReportsService} from './position.reports.service';

import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';

import {exportKeys, routingKeys, valueGetters} from './position.report.latest.component';

import {Subscription} from 'rxjs/Subscription';

@Component({
    moduleId   : module.id,
    templateUrl: 'position.report.history.component.html',
    styleUrls  : ['../../' + COMPONENT_CSS]
})
export class PositionReportHistoryComponent extends AbstractHistoryListComponent<PositionReportData> {

    constructor(private positionReportsService: PositionReportsService,
        route: ActivatedRoute, dateFormatter: DateFormatter, numberPipe: DecimalPipe) {
        super(route, dateFormatter, numberPipe);
    }

    protected loadData(): Subscription {
        return this.positionReportsService.getPositionReportHistory({
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

    protected getTickFromRecord(record: PositionReportData): LineChartColumn[] {
        return [
            {
                type : 'date',
                value: record.received
            },
            {
                label: 'Net position',
                type : 'number',
                value: record.netQuantityLs,
                ccy  : record.clearingCurrency
            },
            {
                label: 'EUR Delta',
                type : 'number',
                value: record.normalizedDelta,
                ccy  : 'EUR'
            },
            {
                label: 'LA',
                type : 'number',
                value: record.compLiquidityAddOn,
                ccy  : record.clearingCurrency
            },
            {
                label: 'EUR Gamma',
                type : 'number',
                value: record.normalizedGamma,
                ccy  : 'EUR'
            },
            {
                label: 'EUR Vega',
                type : 'number',
                value: record.normalizedVega,
                ccy  : 'EUR'
            },
            {
                label: 'EUR Rho',
                type : 'number',
                value: record.normalizedRho,
                ccy  : 'EUR'
            },
            {
                label: 'EUR Theta',
                type : 'number',
                value: record.normalizedTheta,
                ccy  : 'EUR'
            }
        ];
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
        return 'Position Report History';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.POSITION_REPORTS_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

const defaultOrdering: (OrderingCriteria<PositionReportData> | ValueGetter<PositionReportData>)[] = [
    {
        get       : valueGetters.received,
        descending: true
    }
];

//</editor-fold>