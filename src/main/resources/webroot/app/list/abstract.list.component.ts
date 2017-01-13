import {OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';

import {RoutePart} from './bread.crumbs.component';

export abstract class AbstractListComponent<T> extends AbstractComponentWithAutoRefresh implements OnInit {

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

    public abstract get defaultOrdering(): string[];

    public abstract get exportKeys(): string[];

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

        this.data = [];
        for (index = 0; index < data.length; ++index) {
            this.data.push(data[index]);
        }

        delete this.errorMessage;
        this.initialLoad = false;
    }

}