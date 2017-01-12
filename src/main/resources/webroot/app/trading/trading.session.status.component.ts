import {Component} from '@angular/core';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';

import {TradingSessionService, TradingSession} from './trading.session.service';

@Component({
    moduleId: module.id,
    selector: 'trading-session-status',
    templateUrl: 'trading.session.status.component.html',
    styleUrls: ['trading.session.status.component.css']
})
export class TradingSessionStatusComponent extends AbstractComponentWithAutoRefresh {

    public tradingSession: TradingSession;

    constructor(private tradingSessionService: TradingSessionService) {
        super();
    }

    protected loadData(): void {
        this.tradingSessionService.getTradingSessionStatuses().subscribe((tradingSession: TradingSession) => {
            this.tradingSession = tradingSession;
        });
    }

}