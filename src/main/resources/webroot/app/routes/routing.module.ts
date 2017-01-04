import {NgModule} from '@angular/core';
import {RouterModule, Route, Router} from '@angular/router';

import {AuthGuard} from '../auth/auth.routing.guard';
import {AuthService} from '../auth/auth.service';
import {LoginComponent} from '../auth/login.component';
import {AuthModule} from '../auth/auth.module';

import {DashboardModule} from '../dashboard/dashboard.module';
import {DashboardComponent} from '../dashboard/dashboard.component';

import {PositionReportLatestComponent} from '../position-reports/position.report.latest.component';
import {PositionReportHistoryComponent} from '../position-reports/position.report.history.component';

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
    // {
    //     path: 'marginComponentLatest/:clearer/:member/:account/:class/:ccy',
    //     pathMatch: 'full',
    //     component: MarginComponentLatestComponent,
    //     canActivate: [AuthGuard]
    // },
    // {
    //     path: 'marginComponentHistory/:clearer/:member/:account/:class/:ccy',
    //     pathMatch: 'full',
    //     component: MarginComponentHistoryComponent,
    //     canActivate: [AuthGuard]
    // },
    // {
    //     path: 'totalMarginRequirementLatest/:clearer/:pool/:member/:account/:ccy',
    //     pathMatch: 'full',
    //     component: TotalMarginRequirementLatestComponent,
    //     canActivate: [AuthGuard]
    // },
    // {
    //     path: 'totalMarginRequirementHistory/:clearer/:pool/:member/:account/:ccy',
    //     pathMatch: 'full',
    //     component: TotalMarginRequirementHistoryComponent,
    //     canActivate: [AuthGuard]
    // },
    // {
    //     path: 'marginShortfallSurplusHistory/:clearer/:pool/:member/:clearingCcy/:ccy',
    //     pathMatch: 'full',
    //     component: MarginShortfallSurplusHistoryComponent,
    //     canActivate: [AuthGuard]
    // },
    // {
    //     path: 'riskLimitLatest/:clearer/:member/:maintainer/:limitType',
    //     pathMatch: 'full',
    //     component: RiskLimitLatestComponent,
    //     canActivate: [AuthGuard]
    // },
    // {
    //     path: 'riskLimitHistory/:clearer/:member/:maintainer/:limitType',
    //     pathMatch: 'full',
    //     component: RiskLimitHistoryComponent,
    //     canActivate: [AuthGuard]
    // }
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES),
        AuthModule,
        DashboardModule
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