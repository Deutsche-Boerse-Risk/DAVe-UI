import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ErrorResponse} from '../abstract.http.service';
import {RiskLimitsService} from './risk.limits.service';
import {RiskLimitsData} from './risk.limits.types';

import {AbstractLatestListComponent} from '../list/abstract.latest.list.component';

export const routingKeys: string[] = ['clearer', 'member', 'maintainer', 'limitType'];

export const exportKeys: string[] = ['clearer', 'member', 'maintainer', 'limitType', 'utilization', 'warningLevel',
    'warningUtil', 'throttleLevel', 'throttleUtil', 'rejectLevel', 'rejectUtil', 'received'];

const defaultOrdering = ['-rejectUtil', 'clearer', 'member', 'maintainer', 'limitType'];

@Component({
    moduleId: module.id,
    templateUrl: 'risk.limit.latest.component.html',
    styleUrls: ['../common.component.css']
})
export class RiskLimitLatestComponent extends AbstractLatestListComponent<RiskLimitsData> {

    constructor(private riskLimitsService: RiskLimitsService,
                route: ActivatedRoute) {
        super(route);
    }

    protected loadData(): void {
        this.riskLimitsService.getRiskLimitsLatest(this.routeParams['clearer'], this.routeParams['member'],
            this.routeParams['maintainer'], this.routeParams['limitType'])
            .then((rows: RiskLimitsData[]) => {
                this.processData(rows);
            })
            .catch((err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    public get defaultOrdering(): string[] {
        return defaultOrdering;
    }

    protected get exportKeys(): string[] {
        return exportKeys;
    }

    protected get routingKeys(): string[] {
        return routingKeys;
    }

    protected get rootRouteTitle(): string {
        return 'Risk Limits';
    }

    protected get rootRoutePath(): string {
        return '/riskLimitLatest';
    }

}
