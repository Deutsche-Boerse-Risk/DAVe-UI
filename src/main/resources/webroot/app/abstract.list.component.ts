import {OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {RoutePart} from './common/bread.crumbs.component';

import {AbstractComponentWithAutoRefresh} from './abstract.component';

export abstract class AbstractListComponent<T> extends AbstractComponentWithAutoRefresh implements OnInit {

    public initialLoad: boolean = true;

    public errorMessage: string;

    public routeParts: RoutePart[];

    public filterQuery: string;

    private filterTimeoutHandle: NodeJS.Timer;

    public routeParams: Params;

    public data: T[];

    private sourceData: T[];

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

        this.sourceData = this.data;

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
        if (this.filterQuery) {
            let filters: string[] = this.filterQuery.toLowerCase().split(" ");
            let index: number;
            let index2: number;
            let filteredItems: T[] = [];

            for (index = 0; index < this.sourceData.length; index++) {
                let match = true;

                for (index2 = 0; index2 < filters.length; index2++) {
                    if (!MatchObject(this.sourceData[index], filters[index2])) {
                        match = false;
                        break;
                    }
                }

                if (match == true) {
                    filteredItems.push(this.sourceData[index]);
                }
            }

            this.data = filteredItems;
        }
        else {
            this.data = this.sourceData;
        }

        function MatchObject(item: any, search: string): boolean {
            return Object.keys(item).some((key: string) => {
                return String(item[key]).toLowerCase().indexOf(search) !== -1;
            });
        }
    }

}