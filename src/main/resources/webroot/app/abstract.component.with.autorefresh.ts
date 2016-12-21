import {OnInit, OnDestroy, ElementRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {AbstractComponent} from "./abstract.component";

export abstract class AbstractComponentWithAutoRefresh extends AbstractComponent implements OnInit, OnDestroy {

    private intervalHandle: any;

    constructor(router: Router,
                route: ActivatedRoute,
                el: ElementRef) {
        super(router, route, el);
    }

    public ngOnInit(): void {
        this.loadData();
        this.intervalHandle = setInterval(() => {
            this.loadData()
        }, 60000);
    }

    public ngOnDestroy(): void {
        clearInterval(this.intervalHandle);
    }

    protected abstract loadData(): void;
}