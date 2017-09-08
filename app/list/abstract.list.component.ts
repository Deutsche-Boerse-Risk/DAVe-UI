import {OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {ValueGetter} from '@dbg-riskit/dave-ui-common';
import {OrderingCriteria, Row} from '@dbg-riskit/dave-ui-datatable';
import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';

import {AbstractComponent} from '../abstract.component';

import {RoutePart} from './bread.crumbs.component';

export abstract class AbstractListComponent<T extends { uid: string }> extends AbstractComponent
    implements OnInit {

    public initialLoad: boolean = true;

    public routeParts: RoutePart[];

    public routeParams: Params;

    public data: T[];

    public pageSize: number = 20;

    constructor(private route: ActivatedRoute) {
        super();
    }

    public ngOnInit(): void {
        this.route.params.forEach(this.processRoute.bind(this));
    }

    public abstract get defaultOrdering(): (OrderingCriteria<T> | ValueGetter<T>)[];

    public abstract get exportKeys(): CSVExportColumn<T>[];

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
                let part = this.createRoutePart(pathParams[param], pathParams[param], param, index + 1);
                if (part) {
                    this.routeParts.push(part);
                }
            }
        });
        this.initLoad();
    }

    protected createRoutePart(title: string, routePart: string, key: string, index: number): RoutePart {
        return {
            index    : index,
            title    : title,
            routePart: routePart
        };
    }

    protected processData(data: T[]): void {
        this.data = data;
        this.initialLoad = false;
    }

    public trackByRowKey(index: number, row: Row<T>): string {
        return row.rowData.uid;
    }

}