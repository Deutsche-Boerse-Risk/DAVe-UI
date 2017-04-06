import {DecimalPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {DateFormatter} from '../../common/common.module';
import {LineChartColumn} from '../../list/abstract.history.list.component';
import {ExportColumn} from '../../list/download.menu.component';

import {AbstractLiquiGroupSplitMarginHistoryComponent} from '../abstract.liqui.group.split.margin.history.component';
import {LiquiGroupSplitMarginService} from '../liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData} from '../liqui.group.split.margin.types';
import {exportKeys, valueGetters} from './variation.premium.margin.latest.component';
import {VARIATION_PREMIUM_MARGIN_LATEST} from '../../routes/routing.paths';

@Component({
    moduleId   : module.id,
    templateUrl: 'variation.premium.margin.history.component.html',
    styleUrls  : ['../../common.component.css']
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

    public get exportKeys(): ExportColumn<LiquiGroupSplitMarginData>[] {
        return exportKeys;
    }

    public get rootRouteTitle(): string {
        return 'Variation / Premium Margin History';
    }

    protected get rootRoutePath(): string {
        return '/' + VARIATION_PREMIUM_MARGIN_LATEST;
    }

    public get valueGetters() {
        return valueGetters;
    }
}
