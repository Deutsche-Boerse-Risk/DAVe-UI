import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-common';
import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {LineChartColumn} from '../../list/abstract.history.list.component';

import {AbstractLiquiGroupSplitMarginHistoryComponent} from '../abstract.liqui.group.split.margin.history.component';
import {LiquiGroupSplitMarginService} from '../liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData} from '../liqui.group.split.margin.types';
import {exportKeys, valueGetters} from './variation.premium.margin.latest.component';

@Component({
    moduleId   : module.id,
    templateUrl: 'variation.premium.margin.history.component.html',
    styleUrls  : ['../../../' + COMPONENT_CSS]
})
export class VariationPremiumMarginHistoryComponent extends AbstractLiquiGroupSplitMarginHistoryComponent {

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
                label: 'Premium Margin',
                type : 'number',
                value: record.premiumMargin
            },
            {
                label: 'Variation Premium Payment',
                type : 'number',
                value: record.variationPremiumPayment
            }
        ];
    }

    public get exportKeys(): CSVExportColumn<LiquiGroupSplitMarginData>[] {
        return exportKeys;
    }

    public get rootRouteTitle(): string {
        return 'Variation / Premium Margin History';
    }

    protected get rootRoutePath(): string {
        return this.routerRoots.VARIATION_PREMIUM_MARGIN_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}
