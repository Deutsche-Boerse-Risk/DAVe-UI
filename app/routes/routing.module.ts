import {NgModule} from '@angular/core';
import {RouterModule, Route, Router} from '@angular/router';

import {AuthGuard} from '../auth/auth.routing.guard';
import {AuthService} from '../auth/auth.service';
import {LoginComponent} from '../auth/login.component';
import {AuthModule} from '../auth/auth.module';

import {DashboardModule} from '../dashboard/dashboard.module';
import {DashboardComponent} from '../dashboard/dashboard.component';

import {PositionReportsModule} from '../position_reports/position.reports.module';
import {PositionReportLatestComponent} from '../position_reports/position.report.latest.component';
import {PositionReportHistoryComponent} from '../position_reports/position.report.history.component';

import {LiquiGroupMarginModule} from '../liqui_group_margin/liqui.group.margin.module';
import {LiquiGroupMarginLatestComponent} from '../liqui_group_margin/liqui.group.margin.latest.component';
import {LiquiGroupMarginHistoryComponent} from '../liqui_group_margin/liqui.group.margin.history.component';

import {LiquiGroupSplitMarginModule} from '../liqui_group_split_margin/liqui.group.split.margin.module';
import {InitialMarginLatestComponent} from '../liqui_group_split_margin/initial_margin/initial.margin.latest.component';
import {InitialMarginHistoryComponent} from '../liqui_group_split_margin/initial_margin/initial.margin.history.component';
import {VariationPremiumMarginLatestComponent} from '../liqui_group_split_margin/variation_premium_margin/variation.premium.margin.latest.component';
import {VariationPremiumMarginHistoryComponent} from '../liqui_group_split_margin/variation_premium_margin/variation.premium.margin.history.component';

import {PoolMarginModule} from '../pool_margin/pool.margin.module';
import {PoolMarginLatestComponent} from '../pool_margin/pool.margin.latest.component';
import {PoolMarginHistoryComponent} from '../pool_margin/pool.margin.history.component';

import {AccountMarginModule} from '../account_margin/account.margin.module';
import {AccountMarginLatestComponent} from '../account_margin/account.margin.latest.component';
import {AccountMarginHistoryComponent} from '../account_margin/account.margin.history.component';

import {RiskLimitUtilizationModule} from '../risk_limit_utilization/risk.limit.utilization.module';
import {RiskLimitUtilizationLatestComponent} from '../risk_limit_utilization/risk.limit.utilization.latest.component';
import {RiskLimitUtilizationHistoryComponent} from '../risk_limit_utilization/risk.limit.utilization.history.component';
import {
    ACCOUNT_MARGIN_HISTORY,
    ACCOUNT_MARGIN_LATEST,
    LIQUI_GROUP_MARGIN_HISTORY,
    LIQUI_GROUP_MARGIN_LATEST,
    INITIAL_MARGIN_LATEST,
    INITIAL_MARGIN_HISTORY,
    VARIATION_PREMIUM_MARGIN_LATEST,
    VARIATION_PREMIUM_MARGIN_HISTORY,
    POOL_MARGIN_HISTORY,
    POOL_MARGIN_LATEST,
    POSITION_REPORTS_HISTORY,
    POSITION_REPORTS_LATEST,
    RISK_LIMIT_UTILIZATION_HISTORY,
    RISK_LIMIT_UTILIZATION_LATEST
} from './routing.paths';

const ACCOUNT_MARGIN: Route[] = [
    {
        path       : ACCOUNT_MARGIN_LATEST,
        pathMatch  : 'full',
        component  : AccountMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ACCOUNT_MARGIN_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : AccountMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ACCOUNT_MARGIN_LATEST + '/:clearer/:member',
        pathMatch  : 'full',
        component  : AccountMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ACCOUNT_MARGIN_LATEST + '/:clearer/:member/:account',
        pathMatch  : 'full',
        component  : AccountMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ACCOUNT_MARGIN_LATEST + '/:clearer/:member/:account/:marginCurrency',
        pathMatch  : 'full',
        component  : AccountMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ACCOUNT_MARGIN_HISTORY + '/:clearer/:member/:account/:marginCurrency',
        pathMatch  : 'full',
        component  : AccountMarginHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const POSITION_REPORTS: Route[] = [
    {
        path       : POSITION_REPORTS_LATEST,
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_LATEST + '/:clearer/:member',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_LATEST + '/:clearer/:member/:account',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:liquidationGroup',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit/:product',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit/:product/:callPut',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear/:contractMonth',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear/:contractMonth/:expiryDay',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear/:contractMonth/:expiryDay/:exercisePrice',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear/:contractMonth/:expiryDay/:exercisePrice/:version',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear/:contractMonth/:expiryDay/:exercisePrice/:version/:flexContractSymbol',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POSITION_REPORTS_HISTORY + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear/:contractMonth/:expiryDay/:exercisePrice/:version/:flexContractSymbol',
        pathMatch  : 'full',
        component  : PositionReportHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const LIQUI_GROUP_MARGIN: Route[] = [
    {
        path       : LIQUI_GROUP_MARGIN_LATEST,
        pathMatch  : 'full',
        component  : LiquiGroupMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : LIQUI_GROUP_MARGIN_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : LiquiGroupMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : LIQUI_GROUP_MARGIN_LATEST + '/:clearer/:member',
        pathMatch  : 'full',
        component  : LiquiGroupMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : LIQUI_GROUP_MARGIN_LATEST + '/:clearer/:member/:account',
        pathMatch  : 'full',
        component  : LiquiGroupMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : LIQUI_GROUP_MARGIN_LATEST + '/:clearer/:member/:account/:marginClass',
        pathMatch  : 'full',
        component  : LiquiGroupMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : LIQUI_GROUP_MARGIN_LATEST + '/:clearer/:member/:account/:marginClass/:marginCurrency',
        pathMatch  : 'full',
        component  : LiquiGroupMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : LIQUI_GROUP_MARGIN_HISTORY + '/:clearer/:member/:account/:marginClass/:marginCurrency',
        pathMatch  : 'full',
        component  : LiquiGroupMarginHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const INITIAL_MARGIN: Route[] = [
    {
        path       : INITIAL_MARGIN_LATEST,
        pathMatch  : 'full',
        component  : InitialMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : INITIAL_MARGIN_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : InitialMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : INITIAL_MARGIN_LATEST + '/:clearer/:member',
        pathMatch  : 'full',
        component  : InitialMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : INITIAL_MARGIN_LATEST + '/:clearer/:member/:account',
        pathMatch  : 'full',
        component  : InitialMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : INITIAL_MARGIN_LATEST + '/:clearer/:member/:account/:liquidationGroup',
        pathMatch  : 'full',
        component  : InitialMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : INITIAL_MARGIN_HISTORY + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit/:marginCurrency',
        pathMatch  : 'full',
        component  : InitialMarginHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const VARIATION_PREMIUM_MARGIN: Route[] = [
    {
        path       : VARIATION_PREMIUM_MARGIN_LATEST,
        pathMatch  : 'full',
        component  : VariationPremiumMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : VARIATION_PREMIUM_MARGIN_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : VariationPremiumMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : VARIATION_PREMIUM_MARGIN_LATEST + '/:clearer/:member',
        pathMatch  : 'full',
        component  : VariationPremiumMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : VARIATION_PREMIUM_MARGIN_LATEST + '/:clearer/:member/:account',
        pathMatch  : 'full',
        component  : VariationPremiumMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : VARIATION_PREMIUM_MARGIN_LATEST + '/:clearer/:member/:account/:liquidationGroup',
        pathMatch  : 'full',
        component  : VariationPremiumMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : VARIATION_PREMIUM_MARGIN_HISTORY + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit/:marginCurrency',
        pathMatch  : 'full',
        component  : VariationPremiumMarginHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const POOL_MARGIN: Route[] = [
    {
        path       : POOL_MARGIN_LATEST,
        pathMatch  : 'full',
        component  : PoolMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POOL_MARGIN_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : PoolMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POOL_MARGIN_LATEST + '/:clearer/:pool',
        pathMatch  : 'full',
        component  : PoolMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POOL_MARGIN_LATEST + '/:clearer/:pool/:marginCurrency',
        pathMatch  : 'full',
        component  : PoolMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : POOL_MARGIN_HISTORY + '/:clearer/:pool/:marginCurrency',
        pathMatch  : 'full',
        component  : PoolMarginHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const RISK_LIMIT_UTILIZATION: Route[] = [
    {
        path       : RISK_LIMIT_UTILIZATION_LATEST,
        pathMatch  : 'full',
        component  : RiskLimitUtilizationLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : RISK_LIMIT_UTILIZATION_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : RiskLimitUtilizationLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : RISK_LIMIT_UTILIZATION_LATEST + '/:clearer/:member',
        pathMatch  : 'full',
        component  : RiskLimitUtilizationLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : RISK_LIMIT_UTILIZATION_LATEST + '/:clearer/:member/:maintainer',
        pathMatch  : 'full',
        component  : RiskLimitUtilizationLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : RISK_LIMIT_UTILIZATION_LATEST + '/:clearer/:member/:maintainer/:limitType',
        pathMatch  : 'full',
        component  : RiskLimitUtilizationLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : RISK_LIMIT_UTILIZATION_HISTORY + '/:clearer/:member/:maintainer/:limitType',
        pathMatch  : 'full',
        component  : RiskLimitUtilizationHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const ROUTES: Route[] = [
    {
        path      : '',
        redirectTo: '/dashboard',
        pathMatch : 'full'
    },
    {
        path     : 'login',
        pathMatch: 'full',
        component: LoginComponent
    },
    {
        path       : 'dashboard',
        pathMatch  : 'full',
        component  : DashboardComponent,
        canActivate: [AuthGuard]
    },
    ...ACCOUNT_MARGIN,
    ...LIQUI_GROUP_MARGIN,
    ...INITIAL_MARGIN,
    ...VARIATION_PREMIUM_MARGIN,
    ...POSITION_REPORTS,
    ...POOL_MARGIN,
    ...RISK_LIMIT_UTILIZATION,
    {
        path      : '**', // Otherwise
        redirectTo: '/dashboard'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES),
        AuthModule,
        DashboardModule,
        PositionReportsModule,
        AccountMarginModule,
        PoolMarginModule,
        LiquiGroupMarginModule,
        LiquiGroupSplitMarginModule,
        RiskLimitUtilizationModule
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
