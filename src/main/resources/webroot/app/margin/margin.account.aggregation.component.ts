import {Component} from "@angular/core";

import {DataTableRow, DataTableColumn, DataTableFooter} from "../common/datatable/data.table.types";
import {NUMBER_PIPE} from "../common/common.module";

import {AbstractComponentWithAutoRefresh} from "../abstract.component";
import {ErrorResponse} from "../abstract.http.service";

import {MarginService} from "./margin.service";
import {MarginAccountAggregationData} from "./margin.types";

@Component({
    moduleId: module.id,
    selector: 'margin-account-aggregation',
    templateUrl: 'margin.account.aggregation.component.html',
    styleUrls: ['margin.account.aggregation.component.css']
})
export class MarginAccountAggregationComponent extends AbstractComponentWithAutoRefresh {

    public initialLoad: boolean = false;

    public errorMessage: string;

    public headers: DataTableColumn[] = [
        {
            title: 'Clearer',
            sortingKey: 'clearer'
        },
        {
            title: 'Member / Client',
            sortingKey: 'member'
        },
        {
            title: 'Account',
            sortingKey: 'account'
        },
        {
            title: 'Variation Margin',
            sortingKey: 'variationMargin'
        },
        {
            title: 'Liquidation Margin',
            sortingKey: 'liquiMargin'
        },
        {
            title: 'Premium Margin',
            sortingKey: 'premiumMargin'
        },
        {
            title: 'Spread Margin',
            sortingKey: 'spreadMargin'
        },
        {
            title: 'Total Margin',
            sortingKey: 'additionalMargin'
        }
    ];

    public dataRows: DataTableRow[];

    public footer: DataTableFooter = {
        cells: [
            {}, {}, {},
            {
                titleKey: 'variationMargin',
                pipe: NUMBER_PIPE,
                pipeArgs: '.2-2'
            },
            {
                titleKey: 'liquiMargin',
                pipe: NUMBER_PIPE,
                pipeArgs: '.2-2'
            },
            {
                titleKey: 'premiumMargin',
                pipe: NUMBER_PIPE,
                pipeArgs: '.2-2'
            },
            {
                titleKey: 'spreadMargin',
                pipe: NUMBER_PIPE,
                pipeArgs: '.2-2'
            },
            {
                titleKey: 'additionalMargin',
                pipe: NUMBER_PIPE,
                pipeArgs: '.2-2'
            }
        ],
        data: {}
    };

    constructor(private marginService: MarginService) {
        super();
    }

    protected loadData(): void {
        this.marginService.getMarginAccountAggregationData()
            .then(this.processData.bind(this))
            .catch((err: ErrorResponse) => {
                this.errorMessage = "Server returned status " + err.status;
                this.initialLoad = false;
            });
    }

    private processData(data: MarginAccountAggregationData[]): void {
        let newViewWindow: {[key: string]: DataTableRow} = {};
        this.footer.data = {
            variationMargin: 0,
            liquiMargin: 0,
            premiumMargin: 0,
            spreadMargin: 0,
            additionalMargin: 0
        };

        for (let index = 0; index < data.length; ++index) {
            let record = data[index];
            let fKey = record.clearer + '-' + record.member + '-' + record.account;

            if (fKey in newViewWindow) {
                let cellData: MarginAccountAggregationData = newViewWindow[fKey].data;
                cellData.variationMargin += record.variationMargin;
                cellData.liquiMargin += record.liquiMargin;
                cellData.premiumMargin += record.premiumMargin;
                cellData.spreadMargin += record.spreadMargin;
                cellData.additionalMargin += record.additionalMargin;

                this.footer.data.variationMargin += record.variationMargin;
                this.footer.data.liquiMargin += record.liquiMargin;
                this.footer.data.premiumMargin += record.premiumMargin;
                this.footer.data.spreadMargin += record.spreadMargin;
                this.footer.data.additionalMargin += record.additionalMargin;
            }
            else {
                newViewWindow[fKey] = MarginAccountAggregationComponent.createRow(record);

                this.footer.data.variationMargin += record.variationMargin;
                this.footer.data.liquiMargin += record.liquiMargin;
                this.footer.data.premiumMargin += record.premiumMargin;
                this.footer.data.spreadMargin += record.spreadMargin;
                this.footer.data.additionalMargin += record.additionalMargin;
            }
        }

        this.dataRows = Object.keys(newViewWindow).map((key: string) => {
            return newViewWindow[key];
        });

        for (let index = 0; index < this.dataRows.length; ++index) {
            this.dataRows[index].data.absAdditionalMargin = Math.abs(this.dataRows[index].data.additionalMargin);
        }

        // TODO: Ordering        vm.viewWindow = $filter('orderBy')(this.dataRows, vm.ordering);

        delete this.errorMessage;
        this.initialLoad = false;
    }

    private static createRow(data: MarginAccountAggregationData): DataTableRow {
        return {
            cells: [
                {
                    titleKey: 'clearer',
                    routerLink: ['marginComponentLatest', data.clearer],
                },
                {
                    titleKey: 'member',
                    routerLink: ['marginComponentLatest', data.clearer, data.member],
                },
                {
                    titleKey: 'account',
                    routerLink: ['marginComponentLatest', data.clearer, data.member, data.account],
                },
                {
                    titleKey: 'variationMargin',
                    pipe: NUMBER_PIPE,
                    pipeArgs: '.2-2'
                },
                {
                    titleKey: 'liquiMargin',
                    pipe: NUMBER_PIPE,
                    pipeArgs: '.2-2'
                },
                {
                    titleKey: 'premiumMargin',
                    pipe: NUMBER_PIPE,
                    pipeArgs: '.2-2'
                },
                {
                    titleKey: 'spreadMargin',
                    pipe: NUMBER_PIPE,
                    pipeArgs: '.2-2'
                },
                {
                    titleKey: 'additionalMargin',
                    pipe: NUMBER_PIPE,
                    pipeArgs: '.2-2'
                }
            ],
            data: data
        }
    }
}