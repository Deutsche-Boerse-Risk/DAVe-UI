import {NgModule} from '@angular/core';
import {Route, Router, RouterModule} from '@angular/router';

import {LOGIN_ROUTE, MAIN_ROUTE} from '@dbg-riskit/dave-ui-common';
import {AuthGuard, AuthModule, AuthService} from '@dbg-riskit/dave-ui-auth';
import {LoginComponent, LoginModule} from '@dbg-riskit/dave-ui-login';

import {DashboardModule} from '../dashboard/dashboard.module';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {MarginRequirementOverviewComponent} from '../dashboard/margin.requirement.overview.component';

import {PositionReportsModule} from '../position_reports/position.reports.module';
import {PositionReportLatestComponent} from '../position_reports/position.report.latest.component';
import {PositionReportHistoryComponent} from '../position_reports/position.report.history.component';
import {PositionReportBubbleChartComponent} from '../position_reports/position.report.bubblechart.component';

import {LiquiGroupMarginModule} from '../liqui_group_margin/liqui.group.margin.module';
import {LiquiGroupMarginLatestComponent} from '../liqui_group_margin/liqui.group.margin.latest.component';
import {LiquiGroupMarginHistoryComponent} from '../liqui_group_margin/liqui.group.margin.history.component';
import {LiquiGroupMarginTreemapComponent} from '../liqui_group_margin/liqui.group.margin.treemap.component';

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
import {ROUTE_NAMES, ROUTES} from './routing.paths';

const ACCOUNT_MARGIN: Route[] = [
    {
        path       : ROUTE_NAMES.ACCOUNT_MARGIN_LATEST,
        pathMatch  : 'full',
        component  : AccountMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.ACCOUNT_MARGIN_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : AccountMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.ACCOUNT_MARGIN_LATEST + '/:clearer/:member',
        pathMatch  : 'full',
        component  : AccountMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.ACCOUNT_MARGIN_LATEST + '/:clearer/:member/:account',
        pathMatch  : 'full',
        component  : AccountMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.ACCOUNT_MARGIN_LATEST + '/:clearer/:member/:account/:marginCurrency',
        pathMatch  : 'full',
        component  : AccountMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.ACCOUNT_MARGIN_HISTORY + '/:clearer/:member/:account/:marginCurrency',
        pathMatch  : 'full',
        component  : AccountMarginHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const POSITION_REPORTS: Route[] = [
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST,
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer/:member',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer/:member/:account',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:underlying',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:underlying/:liquidationGroup',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:underlying/:liquidationGroup/:liquidationGroupSplit',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:underlying/:liquidationGroup/:liquidationGroupSplit/:product',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:underlying/:liquidationGroup/:liquidationGroupSplit/:product/:callPut',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:underlying/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:underlying/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear/:contractMonth',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:underlying/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear/:contractMonth/:expiryDay',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:underlying/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear/:contractMonth/:expiryDay/:exercisePrice',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:underlying/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear/:contractMonth/:expiryDay/:exercisePrice/:version',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_LATEST + '/:clearer/:member/:account/:underlying/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear/:contractMonth/:expiryDay/:exercisePrice/:version/:flexContractSymbol',
        pathMatch  : 'full',
        component  : PositionReportLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POSITION_REPORTS_HISTORY + '/:clearer/:member/:account/:underlying/:liquidationGroup/:liquidationGroupSplit/:product/:callPut/:contractYear/:contractMonth/:expiryDay/:exercisePrice/:version/:flexContractSymbol',
        pathMatch  : 'full',
        component  : PositionReportHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const LIQUI_GROUP_MARGIN: Route[] = [
    {
        path       : ROUTE_NAMES.LIQUI_GROUP_MARGIN_LATEST,
        pathMatch  : 'full',
        component  : LiquiGroupMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.LIQUI_GROUP_MARGIN_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : LiquiGroupMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.LIQUI_GROUP_MARGIN_LATEST + '/:clearer/:member',
        pathMatch  : 'full',
        component  : LiquiGroupMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.LIQUI_GROUP_MARGIN_LATEST + '/:clearer/:member/:account',
        pathMatch  : 'full',
        component  : LiquiGroupMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.LIQUI_GROUP_MARGIN_LATEST + '/:clearer/:member/:account/:marginClass',
        pathMatch  : 'full',
        component  : LiquiGroupMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.LIQUI_GROUP_MARGIN_HISTORY + '/:clearer/:member/:account/:marginClass/:marginCurrency',
        pathMatch  : 'full',
        component  : LiquiGroupMarginHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const INITIAL_MARGIN: Route[] = [
    {
        path       : ROUTE_NAMES.INITIAL_MARGIN_LATEST,
        pathMatch  : 'full',
        component  : InitialMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.INITIAL_MARGIN_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : InitialMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.INITIAL_MARGIN_LATEST + '/:clearer/:member',
        pathMatch  : 'full',
        component  : InitialMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.INITIAL_MARGIN_LATEST + '/:clearer/:member/:account',
        pathMatch  : 'full',
        component  : InitialMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.INITIAL_MARGIN_LATEST + '/:clearer/:member/:account/:liquidationGroup',
        pathMatch  : 'full',
        component  : InitialMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.INITIAL_MARGIN_LATEST + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit',
        pathMatch  : 'full',
        component  : InitialMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.INITIAL_MARGIN_HISTORY + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit/:marginCurrency',
        pathMatch  : 'full',
        component  : InitialMarginHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const VARIATION_PREMIUM_MARGIN: Route[] = [
    {
        path       : ROUTE_NAMES.VARIATION_PREMIUM_MARGIN_LATEST,
        pathMatch  : 'full',
        component  : VariationPremiumMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.VARIATION_PREMIUM_MARGIN_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : VariationPremiumMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.VARIATION_PREMIUM_MARGIN_LATEST + '/:clearer/:member',
        pathMatch  : 'full',
        component  : VariationPremiumMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.VARIATION_PREMIUM_MARGIN_LATEST + '/:clearer/:member/:account',
        pathMatch  : 'full',
        component  : VariationPremiumMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.VARIATION_PREMIUM_MARGIN_LATEST + '/:clearer/:member/:account/:liquidationGroup',
        pathMatch  : 'full',
        component  : VariationPremiumMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.VARIATION_PREMIUM_MARGIN_HISTORY + '/:clearer/:member/:account/:liquidationGroup/:liquidationGroupSplit/:marginCurrency',
        pathMatch  : 'full',
        component  : VariationPremiumMarginHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const POOL_MARGIN: Route[] = [
    {
        path       : ROUTE_NAMES.POOL_MARGIN_LATEST,
        pathMatch  : 'full',
        component  : PoolMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POOL_MARGIN_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : PoolMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POOL_MARGIN_LATEST + '/:clearer/:pool',
        pathMatch  : 'full',
        component  : PoolMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POOL_MARGIN_LATEST + '/:clearer/:pool/:marginCurrency',
        pathMatch  : 'full',
        component  : PoolMarginLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.POOL_MARGIN_HISTORY + '/:clearer/:pool/:marginCurrency',
        pathMatch  : 'full',
        component  : PoolMarginHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const RISK_LIMIT_UTILIZATION: Route[] = [
    {
        path       : ROUTE_NAMES.RISK_LIMIT_UTILIZATION_LATEST,
        pathMatch  : 'full',
        component  : RiskLimitUtilizationLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.RISK_LIMIT_UTILIZATION_LATEST + '/:clearer',
        pathMatch  : 'full',
        component  : RiskLimitUtilizationLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.RISK_LIMIT_UTILIZATION_LATEST + '/:clearer/:member',
        pathMatch  : 'full',
        component  : RiskLimitUtilizationLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.RISK_LIMIT_UTILIZATION_LATEST + '/:clearer/:member/:maintainer',
        pathMatch  : 'full',
        component  : RiskLimitUtilizationLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.RISK_LIMIT_UTILIZATION_LATEST + '/:clearer/:member/:maintainer/:limitType',
        pathMatch  : 'full',
        component  : RiskLimitUtilizationLatestComponent,
        canActivate: [AuthGuard]
    },
    {
        path       : ROUTE_NAMES.RISK_LIMIT_UTILIZATION_HISTORY + '/:clearer/:member/:maintainer/:limitType',
        pathMatch  : 'full',
        component  : RiskLimitUtilizationHistoryComponent,
        canActivate: [AuthGuard]
    }
];

const ROUTER_DEFINITION: Route[] = [
    {
        path      : '',
        redirectTo: ROUTES.DASHBOARD_MARGIN_REQUIREMENT_OVERVIEW,
        pathMatch : 'full'
    },
    {
        path     : ROUTE_NAMES.LOGIN,
        pathMatch: 'full',
        component: LoginComponent
    },
    {
        path       : ROUTE_NAMES.DASHBOARD,
        component  : DashboardComponent,
        canActivate: [AuthGuard],
        children   : [
            {
                path            : ROUTE_NAMES.DASHBOARD_MARGIN_REQUIREMENT_OVERVIEW,
                pathMatch       : 'full',
                component       : MarginRequirementOverviewComponent,
                canActivateChild: [AuthGuard]
            },
            {
                path            : ROUTE_NAMES.DASHBOARD_POSITION_LEVEL_RISK,
                pathMatch       : 'full',
                component       : PositionReportBubbleChartComponent,
                canActivateChild: [AuthGuard]
            },
            {
                path            : ROUTE_NAMES.DASHBOARD_INITIAL_MARGIN,
                pathMatch       : 'full',
                component       : LiquiGroupMarginTreemapComponent,
                canActivateChild: [AuthGuard]
            },
            {
                path      : '',
                redirectTo: ROUTES.DASHBOARD_MARGIN_REQUIREMENT_OVERVIEW,
                pathMatch : 'prefix'
            }
        ]
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
        redirectTo: ROUTES.DASHBOARD_MARGIN_REQUIREMENT_OVERVIEW
    }
];

@NgModule({
    imports  : [
        RouterModule.forRoot(ROUTER_DEFINITION),
        AuthModule,
        LoginModule,
        DashboardModule,
        PositionReportsModule,
        AccountMarginModule,
        PoolMarginModule,
        LiquiGroupMarginModule,
        LiquiGroupSplitMarginModule,
        RiskLimitUtilizationModule
    ],
    exports  : [RouterModule],
    providers: [
        {
            provide : MAIN_ROUTE,
            useValue: ROUTES.DASHBOARD_MARGIN_REQUIREMENT_OVERVIEW
        },
        {
            provide : LOGIN_ROUTE,
            useValue: ROUTES.LOGIN
        }
    ]
})
export class RoutingModule {

    constructor(authService: AuthService, router: Router) {
        authService.loggedInChange.subscribe((loggedIn: boolean) => {
            if (!loggedIn) {
                if (router.routerState && router.routerState.snapshot && router.routerState.snapshot.url
                    && !router.routerState.snapshot.url.startsWith(ROUTES.LOGIN)) {
                    authService.authRequestedPath = router.routerState.snapshot.url;
                }
                router.navigate([ROUTES.LOGIN]);
            }
        });
    }
}
