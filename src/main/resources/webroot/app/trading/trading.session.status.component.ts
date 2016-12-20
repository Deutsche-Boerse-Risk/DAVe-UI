import {Component, ElementRef, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";

import {AbstractComponent} from "../abstract.component";
import {TradingSessionService, TradingSessionStatus} from "./trading.session.service";

@Component({
    moduleId: module.id,
    selector: 'trading-session-status',
    templateUrl: 'trading.session.status.component.html',
    styleUrls: ['trading.session.status.component.css']
})
export class TradingSessionStatusComponent extends AbstractComponent implements OnInit {

    public status: any;

    constructor(private tradingSessionService: TradingSessionService,
                router: Router,
                route: ActivatedRoute,
                el: ElementRef) {
        super(router, route, el);
    }

    public ngOnInit(): void {
        this.tradingSessionService.getTradingSessionStatuses().then((tss: TradingSessionStatus[]) => {
            if (tss && tss.length) {
                this.status = tss[0];
            }
        });
    }

}