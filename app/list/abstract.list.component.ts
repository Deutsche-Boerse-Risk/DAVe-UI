import {OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';

import {RoutePart} from './bread.crumbs.component';
import {ExportColumn} from './download.menu.component';
import {OrderingCriteria, OrderingValueGetter} from '../datatable/data.table.column.directive';

export abstract class AbstractListComponent<T extends {uid: string}> extends AbstractComponentWithAutoRefresh implements OnInit {

    public initialLoad: boolean = true;

    public errorMessage: string;

    public routeParts: RoutePart[];

    public routeParams: Params;

    public data: T[];

    public pageSize: number = 20;

    constructor(private route: ActivatedRoute) {
        super();
    }

    public ngOnInit(): void {
        this.route.params.forEach(this.processRoute.bind(this));

        super.ngOnInit();
    }

    public abstract get defaultOrdering(): (OrderingCriteria<T> | OrderingValueGetter<T>)[];

    public abstract get exportKeys(): ExportColumn<T>[];

    protected abstract get routingKeys(): string[];

    public abstract get rootRouteTitle(): string;

    protected abstract get rootRoutePath(): string;

    private processRoute(pathParams: Params) {
        this.routeParams = pathParams;
        this.routeParts = [
            this.createRoutePart(this.rootRouteTitle, this.rootRoutePath, null, 0)
        ];
        this.routingKeys.forEach((param: string, index: number) => {
            if (pathParams[param]) {
                this.routeParts.push(this.createRoutePart(pathParams[param], pathParams[param], param, index + 1));
            }
        });
    }

    protected createRoutePart(title: string, routePart: string, key: string, index: number): RoutePart {
        return {
            index: index,
            title: title,
            routePart: routePart
        };
    }

    protected processData(data: T[]): void {
        let index: number;

        // Remember old data
        let oldData: {[key: string]: T} = {};
        if (this.data) {
            this.data.forEach((value: T) => {
                oldData[value.uid] = value;
            });
            delete this.data;
        }
        this.data = [];

        // Merge the new and old data into old array so angular is able to do change detection correctly
        for (index = 0; index < data.length; ++index) {
            let newValue = data[index];
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

        delete this.errorMessage;
        this.initialLoad = false;
    }

    public trackByRowKey(index: number, row: T): string {
        return row.uid;
    }

}