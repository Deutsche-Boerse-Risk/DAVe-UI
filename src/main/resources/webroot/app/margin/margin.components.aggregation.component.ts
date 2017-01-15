import {Component} from '@angular/core';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';

import {ErrorResponse} from '../http.service';

import {MarginComponentsService} from './margin.components.service';
import {MarginComponentsBaseData, MarginComponentsAggregationData} from './margin.types';

const defaultOrdering = ['-absAdditionalMargin', 'clearer', 'member', 'account'];

@Component({
    moduleId: module.id,
    selector: 'margin-components-aggregation',
    templateUrl: 'margin.components.aggregation.component.html',
    styleUrls: ['margin.components.aggregation.component.css']
})
export class MarginComponentsAggregationComponent extends AbstractComponentWithAutoRefresh {

    public initialLoad: boolean = true;

    public errorMessage: string;

    public footer: MarginComponentsBaseData;

    public data: MarginComponentsBaseData[];

    constructor(private marginComponentsService: MarginComponentsService) {
        super();
    }

    public get defaultOrdering(): string[] {
        return defaultOrdering;
    }

    protected loadData(): void {
        this.marginComponentsService.getMarginComponentsAggregationData()
            .subscribe(
                (data: MarginComponentsAggregationData) => {
                    // Remember old data
                    let oldData: {[key: string]: MarginComponentsBaseData} = {};
                    if (this.data) {
                        this.data.forEach((value: MarginComponentsBaseData) => {
                            oldData[value.uid] = value;
                        });
                        delete this.data;
                    }
                    this.data = [];

                    // Merge the new and old data into old array so angular is able to do change detection correctly
                    for (let index: number = 0; index < data.aggregatedRows.length; ++index) {
                        let newValue = data.aggregatedRows[index];
                        let oldValue = oldData[newValue.uid];
                        if (oldValue) {
                            this.data.push(oldValue);
                            Object.keys(oldValue).concat(Object.keys(newValue)).forEach((key: string) => {
                                (<any>oldValue)[key] = (<any>newValue)[key];
                            });
                        } else {
                            this.data.push(newValue);
                        }
                    }
                    oldData = null;

                    // Merge the new and old data into old array so angular is able to do change detection correctly
                    if (this.footer) {
                        Object.keys(this.footer).concat(Object.keys(data.summary)).forEach((key: string) => {
                            (<any>this.footer)[key] = (<any>data.summary)[key];
                        });
                    } else {
                        this.footer = data.summary;
                    }

                    delete this.errorMessage;
                    this.initialLoad = false;
                },
                (err: ErrorResponse) => {
                    delete this.data;
                    delete this.footer;

                    this.errorMessage = 'Server returned status ' + err.status;
                    this.initialLoad = false;
                });
    }

    public trackByRowKey(index: number, row: MarginComponentsBaseData): string {
        return row.uid;
    }
}