import {NgModule} from '@angular/core';
import {RouterModule, Route, Router} from '@angular/router';

import {AuthModule} from '../login/auth.module';
import {LoginComponent} from '../login/login.component';

import {DashboardModule} from '../dashboard/dashboard.module';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {AuthGuard} from './auth.routing.guard';
import {AuthService} from '../login/auth.service';

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
    // {
    //     path: 'positionReportLatest/:clearer/:member/:account/:class/:symbol/:putCall/:strikePrice/:optAttribute/:maturityMonthYear',
    //     pathMatch: 'full',
    //     component: PositionReportLatestComponent,
    //     canActivate: [AuthGuard]
    // },
    // {
    //     path: 'positionReportHistory/:clearer/:member/:account/:class/:symbol/:putCall/:strikePrice/:optAttribute/:maturityMonthYear',
    //     pathMatch: 'full',
    //     component: PositionReportHistoryComponent,
    //     canActivate: [AuthGuard]
    // },
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
    exports: [RouterModule],
    providers: [AuthGuard]
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