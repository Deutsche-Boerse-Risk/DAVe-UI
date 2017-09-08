import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-devkit';
import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {LineChartColumn} from '../../list/abstract.history.list.component';

import {AbstractLiquiGroupSplitMarginHistoryComponent} from '../abstract.liqui.group.split.margin.history.component';
import {LiquiGroupSplitMarginService} from '../liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData} from '../liqui.group.split.margin.types';
import {exportKeys, valueGetters} from './initial.margin.latest.component';

@Component({
    moduleId   : module.id,
    templateUrl: 'initial.margin.history.component.html',
    styleUrls  : ['../../../' + COMPONENT_CSS]
})
export class InitialMarginHistoryComponent extends AbstractLiquiGroupSplitMarginHistoryComponent {

    constructor(liquiGroupSplitMarginService: LiquiGroupSplitMarginService,
        route: ActivatedRoute, dateFormatter: DateFormatter, numberPipe: DecimalPipe) {
        super(liquiGroupSplitMarginService, route, dateFormatter, numberPipe);
    }

    protected getTickFromRecord(record: LiquiGroupSplitMarginData): LineChartColumn[] {
        return [
            {
                type : 'date',
                value: record.received
            },
            {
                label: 'Market Risk',
                type : 'number',
                value: record.marketRisk,
                ccy  : record.marginCurrency
            },
            {
                label: 'Liquidity Add-on (LA)',
                type : 'number',
                value: record.liquRisk,
                ccy  : record.marginCurrency
            },
            {
                label: 'Long Option Credit',
                type : 'number',
                value: record.longOptionCredit,
                ccy  : record.marginCurrency
            },
            {
                label: 'Initial Margin',
                type : 'number',
                value: record.additionalMargin,
                ccy  : record.marginCurrency
            }
        ];
    }

    public get exportKeys(): CSVExportColumn<LiquiGroupSplitMarginData>[] {
        return exportKeys;
    }

    public get rootRouteTitle(): string {
        return 'Initial Margin History';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.INITIAL_MARGIN_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}