import {OnDestroy, OnInit} from '@angular/core';

import {ROUTES} from './routes/routing.paths';

import {Subscription} from 'rxjs/Subscription';

export abstract class AbstractComponent implements OnInit, OnDestroy {

    private dataSubscription: Subscription;

    public ngOnInit(): void {
        this.initLoad();
    }

    protected initLoad() {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
        this.dataSubscription = this.loadData();
    }

    public ngOnDestroy(): void {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
    };

    protected abstract loadData(): Subscription;

    public get routerRoots() {
        return ROUTES;
    }
}