import {OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {RoutePart} from './common/bread.crumbs.component';
import {DataTable} from './common/datatable/data.table.types';

import {AbstractComponentWithAutoRefresh} from './abstract.component';

export abstract class AbstractListComponent<T> extends AbstractComponentWithAutoRefresh implements OnInit {

    public initialLoad: boolean = true;

    public errorMessage: string;

    public routeParts: RoutePart[];

    public filterQuery: string;

    private filterTimeoutHandle: NodeJS.Timer;

    protected routeParams: Params;

    public abstract dataTable: DataTable<T>;

    constructor(private route: ActivatedRoute) {
        super();
    }

    public ngOnInit() {
        this.route.params.forEach(this.processRoute.bind(this))

        super.ngOnInit();
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
        });
    }

    protected processData(data: T[]): void {
        let index;

        for (index = 0; index < data.length; ++index) {
            this.processRecord(data[index]);
        }

        this.filter();

        delete this.errorMessage;
        this.initialLoad = false;
    }


    public filterAfterTimeout() {
        clearTimeout(this.filterTimeoutHandle);
        this.filterTimeoutHandle = setTimeout(() => {
            this.filter();
        }, 100);
    }

    public filter(): void {

    }

    protected abstract processRecord(record: T): void;

}