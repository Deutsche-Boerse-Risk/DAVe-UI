import {OnInit} from '@angular/core';

import {ActivatedRoute, Params} from '@angular/router';
import {RoutePart} from './common/bread.crumbs.component';

export abstract class AbstractListComponent implements OnInit {

    public initialLoad: boolean = false;

    public errorMessage: string;

    public routeParts: RoutePart[];

    public filterQuery: string;

    private filterTimeoutHandle: NodeJS.Timer;

    protected routeParams: Params;

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit() {
        this.route.params.forEach(this.processRoute.bind(this));
    }

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
            this.loadData();
        });
    }



    public filterAfterTimeout() {
        clearTimeout(this.filterTimeoutHandle);
        this.filterTimeoutHandle = setTimeout(() => {
            this.filter();
        }, 100);
    }

    public filter(): void {

    }

    protected abstract loadData(): void;

}