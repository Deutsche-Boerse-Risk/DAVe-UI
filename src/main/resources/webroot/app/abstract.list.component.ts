import {OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {AbstractComponentWithAutoRefresh} from './abstract.component';

import {RoutePart} from './list/bread.crumbs.component';

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

    public ngOnInit() {
        this.route.params.forEach(this.processRoute.bind(this));

        super.ngOnInit();
    }

    public abstract get defaultOrdering(): string[];

    protected abstract get exportKeys(): string[];

    protected abstract get routingKeys(): string[];

    protected abstract get rootRouteTitle(): string;

    protected abstract get rootRoutePath(): string;

    private processRoute(pathParams: Params) {
        this.routeParams = pathParams;
        this.routeParts = [{
            title: this.rootRouteTitle,
            routePart: this.rootRoutePath
        }];
        this.routingKeys.forEach((param: string) => {
            if (pathParams[param]) {
                this.routeParts.push({
                    title: pathParams[param],
                    routePart: pathParams[param]
                });
            }
        });
    }

    protected processData(data: T[]): void {
        let index;

        this.data = [];
        for (index = 0; index < data.length; ++index) {
            this.data.push(data[index]);
        }

        delete this.errorMessage;
        this.initialLoad = false;
    }

}