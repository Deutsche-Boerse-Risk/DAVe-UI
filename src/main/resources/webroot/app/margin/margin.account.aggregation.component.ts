import {Component} from '@angular/core';

import {DataTable} from '../common/datatable/data.table.types';
import {NUMBER_PIPE} from '../common/common.module';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';
import {ErrorResponse} from '../abstract.http.service';

import {MarginService} from './margin.service';
import {MarginAccountAggregationData} from './margin.types';

const defaultOrdering = ['-absAdditionalMargin', 'clearer', 'member', 'account'];

@Component({
    moduleId: module.id,
    selector: 'margin-account-aggregation',
    templateUrl: 'margin.account.aggregation.component.html',
    styleUrls: ['margin.account.aggregation.component.css']
})
export class MarginAccountAggregationComponent extends AbstractComponentWithAutoRefresh {

    public initialLoad: boolean = false;

    public errorMessage: string;

    public dataTable: DataTable<MarginAccountAggregationData> = {
        header: [
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
        ],
        rows: {
            cells: [
                {
                    titleKey: 'clearer',
                    routerLink: ['marginComponentLatest', '{{clearer}}'],
                },
                {
                    titleKey: 'member',
                    routerLink: ['marginComponentLatest', '{{clearer}}', '{{member}}'],
                },
                {
                    titleKey: 'account',
                    routerLink: ['marginComponentLatest', '{{clearer}}', '{{member}}', '{{account}}'],
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
            data: []
        },
        defaultOrdering: defaultOrdering,
        footer: {
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
            data: []
        }
    };

    constructor(private marginService: MarginService) {
        super();
    }

    protected loadData(): void {
        this.marginService.getMarginAccountAggregationData()
            .then(this.processData.bind(this))
            .catch((err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    private processData(data: MarginAccountAggregationData[]): void {
        let newViewWindow: {[key: string]: MarginAccountAggregationData} = {};
        let footerData: MarginAccountAggregationData = {
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
                let cellData: MarginAccountAggregationData = newViewWindow[fKey];
                cellData.variationMargin += record.variationMargin;
                cellData.liquiMargin += record.liquiMargin;
                cellData.premiumMargin += record.premiumMargin;
                cellData.spreadMargin += record.spreadMargin;
                cellData.additionalMargin += record.additionalMargin;

                footerData.variationMargin += record.variationMargin;
                footerData.liquiMargin += record.liquiMargin;
                footerData.premiumMargin += record.premiumMargin;
                footerData.spreadMargin += record.spreadMargin;
                footerData.additionalMargin += record.additionalMargin;
            }
            else {
                newViewWindow[fKey] = record;

                footerData.variationMargin += record.variationMargin;
                footerData.liquiMargin += record.liquiMargin;
                footerData.premiumMargin += record.premiumMargin;
                footerData.spreadMargin += record.spreadMargin;
                footerData.additionalMargin += record.additionalMargin;
            }
        }

        this.dataTable.rows.data = Object.keys(newViewWindow).map((key: string) => {
            newViewWindow[key].absAdditionalMargin = Math.abs(newViewWindow[key].additionalMargin);
            return newViewWindow[key];
        });

        // TODO: Ordering        vm.viewWindow = $filter('orderBy')(this.dataRows, vm.ordering);

        this.dataTable.footer.data = [footerData];

        delete this.errorMessage;
        this.initialLoad = false;
    }
}