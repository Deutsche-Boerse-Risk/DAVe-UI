import {OnInit, OnDestroy} from '@angular/core';
import {ROUTES} from './routes/routing.paths';

export const DATA_REFRESH_INTERVAL = 60000;

export abstract class AbstractComponentWithAutoRefresh implements OnInit, OnDestroy {

    private intervalHandle: NodeJS.Timer;

    public ngOnInit(): void {
        this.loadData();
        this.intervalHandle = setInterval(() => {
            this.loadData();
        }, DATA_REFRESH_INTERVAL);
    }

    public ngOnDestroy(): void {
        clearInterval(this.intervalHandle);
    }

    protected abstract loadData(): void;

    public get routerRoots() {
        return ROUTES;
    }
}