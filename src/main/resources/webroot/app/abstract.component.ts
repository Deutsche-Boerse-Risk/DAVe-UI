import {OnInit, OnDestroy} from '@angular/core';

export abstract class AbstractComponentWithAutoRefresh implements OnInit, OnDestroy {

    private intervalHandle: NodeJS.Timer;

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