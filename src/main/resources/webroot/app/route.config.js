(function () {
    'use strict';

    angular.module('dave').config(routeConfig);
    angular.module('dave').run(loginRedirect);

    function routeConfig($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'app/login/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        }).when('/dashboard', {
            templateUrl: 'app/dashboard/dashboard.html',
            controller: 'DashboardController',
            controllerAs: 'vm'
        }).when('/positionReportLatest', {
            templateUrl: 'app/position-reports/position-report-latest.html',
            controller: 'PositionReportLatestController',
            controllerAs: 'vm'
        }).when('/positionReportLatest/:clearer', {
            templateUrl: 'app/position-reports/position-report-latest.html',
            controller: 'PositionReportLatestController',
            controllerAs: 'vm'
        }).when('/positionReportLatest/:clearer/:member', {
            templateUrl: 'app/position-reports/position-report-latest.html',
            controller: 'PositionReportLatestController',
            controllerAs: 'vm'
        }).when('/positionReportLatest/:clearer/:member/:account', {
            templateUrl: 'app/position-reports/position-report-latest.html',
            controller: 'PositionReportLatestController',
            controllerAs: 'vm'
        }).when('/positionReportLatest/:clearer/:member/:account/:class', {
            templateUrl: 'app/position-reports/position-report-latest.html',
            controller: 'PositionReportLatestController',
            controllerAs: 'vm'
        }).when('/positionReportLatest/:clearer/:member/:account/:class/:symbol', {
            templateUrl: 'app/position-reports/position-report-latest.html',
            controller: 'PositionReportLatestController',
            controllerAs: 'vm'
        }).when('/positionReportLatest/:clearer/:member/:account/:class/:symbol/:putCall', {
            templateUrl: 'app/position-reports/position-report-latest.html',
            controller: 'PositionReportLatestController',
            controllerAs: 'vm'
        }).when('/positionReportLatest/:clearer/:member/:account/:class/:symbol/:putCall/:strikePrice', {
            templateUrl: 'app/position-reports/position-report-latest.html',
            controller: 'PositionReportLatestController',
            controllerAs: 'vm'
        }).when('/positionReportLatest/:clearer/:member/:account/:class/:symbol/:putCall/:strikePrice/:optAttribute', {
            templateUrl: 'app/position-reports/position-report-latest.html',
            controller: 'PositionReportLatestController',
            controllerAs: 'vm'
        }).when('/positionReportLatest/:clearer/:member/:account/:class/:symbol/:putCall/:strikePrice/:optAttribute/:maturityMonthYear', {
            templateUrl: 'app/position-reports/position-report-latest.html',
            controller: 'PositionReportLatestController',
            controllerAs: 'vm'
        }).when('/positionReportHistory/:clearer/:member/:account/:class/:symbol/:putCall/:strikePrice/:optAttribute/:maturityMonthYear', {
            templateUrl: 'app/position-reports/position-report-history.html',
            controller: 'PositionReportHistoryController',
            controllerAs: 'vm'
        }).when('/marginComponentLatest', {
            templateUrl: 'app/margin-components/margin-component-latest.html',
            controller: 'MarginComponentLatestController',
            controllerAs: 'vm'
        }).when('/marginComponentLatest/:clearer', {
            templateUrl: 'app/margin-components/margin-component-latest.html',
            controller: 'MarginComponentLatestController',
            controllerAs: 'vm'
        }).when('/marginComponentLatest/:clearer/:member', {
            templateUrl: 'app/margin-components/margin-component-latest.html',
            controller: 'MarginComponentLatestController',
            controllerAs: 'vm'
        }).when('/marginComponentLatest/:clearer/:member/:account', {
            templateUrl: 'app/margin-components/margin-component-latest.html',
            controller: 'MarginComponentLatestController',
            controllerAs: 'vm'
        }).when('/marginComponentLatest/:clearer/:member/:account/:class', {
            templateUrl: 'app/margin-components/margin-component-latest.html',
            controller: 'MarginComponentLatestController',
            controllerAs: 'vm'
        }).when('/marginComponentLatest/:clearer/:member/:account/:class/:ccy', {
            templateUrl: 'app/margin-components/margin-component-latest.html',
            controller: 'MarginComponentLatestController',
            controllerAs: 'vm'
        }).when('/marginComponentHistory/:clearer/:member/:account/:class/:ccy', {
            templateUrl: 'app/margin-components/margin-component-history.html',
            controller: 'MarginComponentHistoryController',
            controllerAs: 'vm'
        }).when('/totalMarginRequirementLatest', {
            templateUrl: 'app/total-margin-requirement/total-margin-requirement-latest.html',
            controller: 'TotalMarginRequirementLatestController',
            controllerAs: 'vm'
        }).when('/totalMarginRequirementLatest/:clearer', {
            templateUrl: 'app/total-margin-requirement/total-margin-requirement-latest.html',
            controller: 'TotalMarginRequirementLatestController',
            controllerAs: 'vm'
        }).when('/totalMarginRequirementLatest/:clearer/:pool', {
            templateUrl: 'app/total-margin-requirement/total-margin-requirement-latest.html',
            controller: 'TotalMarginRequirementLatestController',
            controllerAs: 'vm'
        }).when('/totalMarginRequirementLatest/:clearer/:pool/:member', {
            templateUrl: 'app/total-margin-requirement/total-margin-requirement-latest.html',
            controller: 'TotalMarginRequirementLatestController',
            controllerAs: 'vm'
        }).when('/totalMarginRequirementLatest/:clearer/:pool/:member/:account', {
            templateUrl: 'app/total-margin-requirement/total-margin-requirement-latest.html',
            controller: 'TotalMarginRequirementLatestController',
            controllerAs: 'vm'
        }).when('/totalMarginRequirementLatest/:clearer/:pool/:member/:account/:ccy', {
            templateUrl: 'app/total-margin-requirement/total-margin-requirement-latest.html',
            controller: 'TotalMarginRequirementLatestController',
            controllerAs: 'vm'
        }).when('/totalMarginRequirementHistory/:clearer/:pool/:member/:account/:ccy', {
            templateUrl: 'app/total-margin-requirement/total-margin-requirement-history.html',
            controller: 'TotalMarginRequirementHistoryController',
            controllerAs: 'vm'
        }).when('/marginShortfallSurplusLatest', {
            templateUrl: 'app/margin-shortfall-surplus/margin-shortfall-surplus-latest.html',
            controller: 'MarginShortfallSurplusLatestController',
            controllerAs: 'vm'
        }).when('/marginShortfallSurplusLatest/:clearer', {
            templateUrl: 'app/margin-shortfall-surplus/margin-shortfall-surplus-latest.html',
            controller: 'MarginShortfallSurplusLatestController',
            controllerAs: 'vm'
        }).when('/marginShortfallSurplusLatest/:clearer/:pool', {
            templateUrl: 'app/margin-shortfall-surplus/margin-shortfall-surplus-latest.html',
            controller: 'MarginShortfallSurplusLatestController',
            controllerAs: 'vm'
        }).when('/marginShortfallSurplusLatest/:clearer/:pool/:member', {
            templateUrl: 'app/margin-shortfall-surplus/margin-shortfall-surplus-latest.html',
            controller: 'MarginShortfallSurplusLatestController',
            controllerAs: 'vm'
        }).when('/marginShortfallSurplusLatest/:clearer/:pool/:member/:clearingCyy', {
            templateUrl: 'app/margin-shortfall-surplus/margin-shortfall-surplus-latest.html',
            controller: 'MarginShortfallSurplusLatestController',
            controllerAs: 'vm'
        }).when('/marginShortfallSurplusHistory/:clearer/:pool/:member/:clearingCcy/:ccy', {
            templateUrl: 'app/margin-shortfall-surplus/margin-shortfall-surplus-history.html',
            controller: 'MarginShortfallSurplusHistoryController',
            controllerAs: 'vm'
        }).when('/riskLimitLatest', {
            templateUrl: 'app/risk-limits/risk-limit-latest.html',
            controller: 'RiskLimitLatestController',
            controllerAs: 'vm'
        }).when('/riskLimitLatest/:clearer', {
            templateUrl: 'app/risk-limits/risk-limit-latest.html',
            controller: 'RiskLimitLatestController',
            controllerAs: 'vm'
        }).when('/riskLimitLatest/:clearer/:member', {
            templateUrl: 'app/risk-limits/risk-limit-latest.html',
            controller: 'RiskLimitLatestController',
            controllerAs: 'vm'
        }).when('/riskLimitLatest/:clearer/:member/:maintainer', {
            templateUrl: 'app/risk-limits/risk-limit-latest.html',
            controller: 'RiskLimitLatestController',
            controllerAs: 'vm'
        }).when('/riskLimitLatest/:clearer/:member/:maintainer/:limitType', {
            templateUrl: 'app/risk-limits/risk-limit-latest.html',
            controller: 'RiskLimitLatestController',
            controllerAs: 'vm'
        }).when('/riskLimitHistory/:clearer/:member/:maintainer/:limitType', {
            templateUrl: 'app/risk-limits/risk-limit-history.html',
            controller: 'RiskLimitHistoryController',
            controllerAs: 'vm'
        }).otherwise({
            redirectTo: '/dashboard'
        });
    };

    function loginRedirect($rootScope, $location, $localStorage) {
        // register listener to watch route changes
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (!$localStorage.currentUser) {
                // no logged user, we should be going to #login
                if (next.templateUrl == "app/login/login.html") {
                    // already going to #login, no redirect needed
                } else {
                    // not going to #login, we should redirect now
                    if ($location.path() == "") {
                        $rootScope.authRequestedPath = "/dashboard";
                    }
                    else {
                        $rootScope.authRequestedPath = $location.path();
                    }

                    $location.path("/login");
                }
            }
        });
    };
})();

