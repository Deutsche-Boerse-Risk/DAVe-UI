import {Component, ElementRef} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";

import {AbstractComponentWithAutoRefresh} from "../abstract.component.with.autorefresh";

import {MarginService} from "./margin.service";
import {MarginShortfallSurplus} from "./margin.types";

@Component({
    moduleId: module.id,
    selector: 'margin-shortfall-surplus-latest-summary',
    templateUrl: 'margin.shortfall.surplus.latest.summary.component.html',
    styleUrls: ['margin.shortfall.surplus.latest.summary.component.css']
})
export class MarginShortfallSurplusLatestSummaryComponent extends AbstractComponentWithAutoRefresh {

    public shortfallSurplus: number = 0;

    public marginRequirement: number = 0;

    public securityCollateral: number = 0;

    public cashBalance: number = 0;

    public marginCall: number = 0;

    constructor(private marginService: MarginService,
                router: Router,
                route: ActivatedRoute,
                el: ElementRef) {
        super(router, route, el);
    }

    protected loadData(): void {
        this.marginService.getMarginShortfallSurplusData()
            .then(this.processData.bind(this))
    }

    private processData(data: MarginShortfallSurplus[]): void {
        this.shortfallSurplus = 0;
        this.marginRequirement = 0;
        this.securityCollateral = 0;
        this.cashBalance = 0;
        this.marginCall = 0;

        for (let index = 0; index < data.length; ++index) {
            this.shortfallSurplus += data[index].shortfallSurplus;
            this.marginRequirement += data[index].marginRequirement;
            this.securityCollateral += data[index].securityCollateral;
            this.cashBalance += data[index].cashBalance;
            this.marginCall += data[index].marginCall;
        }
    }

}