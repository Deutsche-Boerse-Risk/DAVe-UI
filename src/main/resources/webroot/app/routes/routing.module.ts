import {NgModule} from '@angular/core';
import {RouterModule, Route, Router} from '@angular/router';

import {AuthGuard} from '../auth/auth.routing.guard';
import {AuthService} from '../auth/auth.service';
import {LoginComponent} from '../auth/login.component';
import {AuthModule} from '../auth/auth.module';

import {DashboardModule} from '../dashboard/dashboard.module';
import {DashboardComponent} from '../dashboard/dashboard.component';

import {PositionReportsModule} from '../position-reports/position.reports.module';
import {PositionReportLatestComponent} from '../position-reports/position.report.latest.component';
import {PositionReportHistoryComponent} from '../position-reports/position.report.history.component';

import {MarginModule} from '../margin/margin.module';
import {MarginComponentsLatestComponent} from '../margin/margin.components.latest.component';
import {MarginComponentsHistoryComponent} from '../margin/margin.components.history.component';
import {MarginShortfallSurplusLatestComponent} from '../margin/margin.shortfall.surplus.latest.component';
import {MarginShortfallSurplusHistoryComponent} from '../margin/margin.shortfall.surplus.history.component';

import {TotalMarginModule} from '../total-margin/total.margin.module';
import {TotalMarginRequirementLatestComponent} from '../total-margin/total.margin.requirement.latest.component';
import {TotalMarginRequirementHistoryComponent} from '../total-margin/total.margin.requirement.history.component';

import {RiskLimitsModule} from '../risk-limits/risk.limits.module';
import {RiskLimitLatestComponent} from '../risk-limits/risk.limit.latest.component';
import {RiskLimitHistoryComponent} from '../risk-limits/risk.limit.history.component';

const ROUTES: Route[] = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        pathMatch: 'full',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'positionReportLatest',
        pathMatch: 'full',
        component: PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'positionReportLatest/:clearer',
        pathMatch: 'full',
        component: PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'positionReportLatest/:clearer/:member',
        pathMatch: 'full',
        component: PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'positionReportLatest/:clearer/:member/:account',
        pathMatch: 'full',
        component: PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'positionReportLatest/:clearer/:member/:account/:class',
        pathMatch: 'full',
        component: PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'positionReportLatest/:clearer/:member/:account/:class/:symbol',
        pathMatch: 'full',
        component: PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'positionReportLatest/:clearer/:member/:account/:class/:symbol/:putCall',
        pathMatch: 'full',
        component: PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'positionReportLatest/:clearer/:member/:account/:class/:symbol/:putCall/:strikePrice',
        pathMatch: 'full',
        component: PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'positionReportLatest/:clearer/:member/:account/:class/:symbol/:putCall/:strikePrice/:optAttribute',
        pathMatch: 'full',
        component: PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'positionReportLatest/:clearer/:member/:account/:class/:symbol/:putCall/:strikePrice/:optAttribute/:maturityMonthYear',
        pathMatch: 'full',
        component: PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'positionReportHistory/:clearer/:member/:account/:class/:symbol/:putCall/:strikePrice/:optAttribute/:maturityMonthYear',
        pathMatch: 'full',
        component: PositionReportHistoryComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marginComponentLatest',
        pathMatch: 'full',
        component: MarginComponentsLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marginComponentLatest/:clearer',
        pathMatch: 'full',
        component: MarginComponentsLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marginComponentLatest/:clearer/:member',
        pathMatch: 'full',
        component: MarginComponentsLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marginComponentLatest/:clearer/:member/:account',
        pathMatch: 'full',
        component: MarginComponentsLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marginComponentLatest/:clearer/:member/:account/:class',
        pathMatch: 'full',
        component: MarginComponentsLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marginComponentLatest/:clearer/:member/:account/:class/:ccy',
        pathMatch: 'full',
        component: MarginComponentsLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marginComponentHistory/:clearer/:member/:account/:class/:ccy',
        pathMatch: 'full',
        component: MarginComponentsHistoryComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'totalMarginRequirementLatest',
        pathMatch: 'full',
        component: TotalMarginRequirementLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'totalMarginRequirementLatest/:clearer',
        pathMatch: 'full',
        component: TotalMarginRequirementLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'totalMarginRequirementLatest/:clearer/:pool',
        pathMatch: 'full',
        component: TotalMarginRequirementLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'totalMarginRequirementLatest/:clearer/:pool/:member',
        pathMatch: 'full',
        component: TotalMarginRequirementLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'totalMarginRequirementLatest/:clearer/:pool/:member/:account',
        pathMatch: 'full',
        component: TotalMarginRequirementLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'totalMarginRequirementLatest/:clearer/:pool/:member/:account/:ccy',
        pathMatch: 'full',
        component: TotalMarginRequirementLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'totalMarginRequirementHistory/:clearer/:pool/:member/:account/:ccy',
        pathMatch: 'full',
        component: TotalMarginRequirementHistoryComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marginShortfallSurplusLatest',
        pathMatch: 'full',
        component: MarginShortfallSurplusLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marginShortfallSurplusLatest/:clearer',
        pathMatch: 'full',
        component: MarginShortfallSurplusLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marginShortfallSurplusLatest/:clearer/:pool',
        pathMatch: 'full',
        component: MarginShortfallSurplusLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marginShortfallSurplusLatest/:clearer/:pool/:member',
        pathMatch: 'full',
        component: MarginShortfallSurplusLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marginShortfallSurplusLatest/:clearer/:pool/:member/:clearingCcy',
        pathMatch: 'full',
        component: MarginShortfallSurplusLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'marginShortfallSurplusHistory/:clearer/:pool/:member/:clearingCcy/:ccy',
        pathMatch: 'full',
        component: MarginShortfallSurplusHistoryComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'riskLimitLatest',
        pathMatch: 'full',
        component: RiskLimitLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'riskLimitLatest/:clearer',
        pathMatch: 'full',
        component: RiskLimitLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'riskLimitLatest/:clearer/:member',
        pathMatch: 'full',
        component: RiskLimitLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'riskLimitLatest/:clearer/:member/:maintainer',
        pathMatch: 'full',
        component: RiskLimitLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'riskLimitLatest/:clearer/:member/:maintainer/:limitType',
        pathMatch: 'full',
        component: RiskLimitLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'riskLimitHistory/:clearer/:member/:maintainer/:limitType',
        pathMatch: 'full',
        component: RiskLimitHistoryComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**', // Otherwise
        redirectTo: '/dashboard'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES, {useHash: true}), // TODO remove hash once we support fallback to index.html
        AuthModule,
        DashboardModule,
        PositionReportsModule,
        MarginModule,
        TotalMarginModule,
        RiskLimitsModule
    ],
    exports: [RouterModule]
})
export class RoutingModule {

    constructor(authService: AuthService, router: Router) {
        authService.loggedInChange.subscribe((loggedIn: boolean) => {
            if (!loggedIn) {
                router.navigate(['login']);
            }
        });
    }
}