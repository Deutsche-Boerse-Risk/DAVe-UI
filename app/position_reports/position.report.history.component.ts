import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {COMPONENT_CSS, ErrorResponse, ValueGetter} from '@dbg-riskit/dave-ui-common';
import {OrderingCriteria} from '@dbg-riskit/dave-ui-datatable';
import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {PositionReportData} from './position.report.types';
import {PositionReportsService} from './position.reports.service';

import {AbstractHistoryListComponent, LineChartColumn} from '../list/abstract.history.list.component';

import {exportKeys, routingKeys, valueGetters} from './position.report.latest.component';

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

    protected loadData(): void {
        this.positionReportsService.getPositionReportHistory({
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
            },
            (err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
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
                value: record.netQuantityLs
            },
            {
                label: 'EuroDelta',
                type : 'number',
                value: record.normalizedDelta
            },
            {
                label: 'LA',
                type : 'number',
                value: record.compLiquidityAddOn
            },
            {
                label: 'Gamma',
                type : 'number',
                value: record.normalizedGamma
            },
            {
                label: 'Vega',
                type : 'number',
                value: record.normalizedVega
            },
            {
                label: 'Rho',
                type : 'number',
                value: record.normalizedRho
            },
            {
                label: 'Theta',
                type : 'number',
                value: record.normalizedTheta
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