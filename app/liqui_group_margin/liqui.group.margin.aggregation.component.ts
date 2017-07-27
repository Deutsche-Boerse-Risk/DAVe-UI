import {Component} from '@angular/core';

import {COMPONENT_CSS, ValueGetter} from '@dbg-riskit/dave-ui-common';
import {OrderingCriteria, Row} from '@dbg-riskit/dave-ui-datatable';

import {AbstractComponent} from '../abstract.component';

import {
    LiquiGroupMarginAggregationData,
    LiquiGroupMarginBaseData,
    LiquiGroupMarginData
} from './liqui.group.margin.types';
import {LiquiGroupMarginService} from './liqui.group.margin.service';

import {Subscription} from 'rxjs/Subscription';

@Component({
    moduleId   : module.id,
    selector   : 'liqui-group-margin-aggregation',
    templateUrl: 'liqui.group.margin.aggregation.component.html',
    styleUrls  : [
        '../../' + COMPONENT_CSS,
        'liqui.group.margin.aggregation.component.css'
    ]
})
export class LiquiGroupMarginAggregationComponent extends AbstractComponent {

    public initialLoad: boolean = true;

    public footer: LiquiGroupMarginBaseData;

    public data: LiquiGroupMarginData[];

    constructor(private liquiGroupMarginService: LiquiGroupMarginService) {
        super();
    }

    public get defaultOrdering(): (
        OrderingCriteria<LiquiGroupMarginBaseData>
        | ValueGetter<LiquiGroupMarginBaseData>)[] {
        return defaultOrdering;
    }

    protected loadData(): Subscription {
        return this.liquiGroupMarginService.getLiquiGroupMarginAggregationData()
            .subscribe(
                (data: LiquiGroupMarginAggregationData) => {
                    this.data = data.aggregatedRows;

                    // Merge the new and old data into old array so angular is able to do change detection correctly
                    if (this.footer) {
                        Object.keys(this.footer).concat(Object.keys(data.summary)).forEach((key: string) => {
                            (<any>this.footer)[key] = (<any>data.summary)[key];
                        });
                    } else {
                        this.footer = data.summary;
                    }

                    this.initialLoad = false;
                });
    }

    public trackByRowKey(index: number, row: Row<LiquiGroupMarginData>): string {
        return row.rowData.uid;
    }

    public get valueGetters() {
        return valueGetters;
    }
}

//<editor-fold defaultstate="collapsed" desc="Value getters, default ordering, exported columns">

export const valueGetters = {
    clearer                    : (row: LiquiGroupMarginData) => row.clearer,
    member                     : (row: LiquiGroupMarginData) => row.member,
    account                    : (row: LiquiGroupMarginData) => row.account,
    premiumMargin              : (row: LiquiGroupMarginData) => row.premiumMargin,
    currentLiquidatingMargin   : (row: LiquiGroupMarginData) => row.currentLiquidatingMargin,
    additionalMargin           : (row: LiquiGroupMarginData) => row.additionalMargin,
    unadjustedMarginRequirement: (row: LiquiGroupMarginData) => row.unadjustedMarginRequirement,
    variationPremiumPayment    : (row: LiquiGroupMarginData) => row.variationPremiumPayment
};

const defaultOrdering: (
    OrderingCriteria<LiquiGroupMarginData>
    | ValueGetter<LiquiGroupMarginData>)[] = [
    {
        get       : (row: LiquiGroupMarginData) => Math.abs(row.additionalMargin),
        descending: true
    },
    valueGetters.clearer,
    valueGetters.member,
    valueGetters.account
];

//</editor-fold>