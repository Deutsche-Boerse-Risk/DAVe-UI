import {Component} from '@angular/core';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';

import {TradingSessionService, TradingSessionStatus} from './trading.session.service';

@Component({
    moduleId: module.id,
    selector: 'trading-session-status',
    templateUrl: 'trading.session.status.component.html',
    styleUrls: ['trading.session.status.component.css']
})
export class TradingSessionStatusComponent extends AbstractComponentWithAutoRefresh {

    public status: any;

    constructor(private tradingSessionService: TradingSessionService) {
        super();
    }

    protected loadData(): void {
        this.tradingSessionService.getTradingSessionStatuses().then((tss: TradingSessionStatus[]) => {
            if (tss && tss.length) {
                this.status = tss[0];
            }
        });
    }

}