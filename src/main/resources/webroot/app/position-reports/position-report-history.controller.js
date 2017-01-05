/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').controller('PositionReportHistoryController', PositionReportHistoryController);

    function PositionReportHistoryController($scope, $routeParams, $http, $interval, $filter, sortRecordsService, recordCountService, updateViewWindowService, showExtraInfoService, downloadAsCsvService, hostConfig) {
        BaseHistoryController.call(this, $scope, $http, $interval, sortRecordsService, recordCountService, updateViewWindowService, showExtraInfoService, downloadAsCsvService);
        var vm = this;
        vm.route = {
            "clearer": $routeParams.clearer,
            "member": $routeParams.member,
            "account": $routeParams.account,
            "class": $routeParams.class,
            "symbol": $routeParams.symbol,
            "putCall": $routeParams.putCall,
            "strikePrice": $routeParams.strikePrice,
            "optAttribute": $routeParams.optAttribute,
            "maturityMonthYear": $routeParams.maturityMonthYear
        };
        vm.defaultOrdering = ["-received"];
        vm.ordering = vm.defaultOrdering;
        vm.exportKeys = ["clearer", "member", "account", "bizDt", "symbol", "putCall", "maturityMonthYear", "strikePrice", "optAttribute",
            "crossMarginLongQty", "crossMarginShortQty", "optionExcerciseQty", "optionAssignmentQty", "allocationTradeQty", "deliveryNoticeQty",
            "clearingCcy", "mVar", "compVar", "compCorrelationBreak", "compCompressionError", "compLiquidityAddOn", "compLongOptionCredit",
            "productCcy", "variationMarginPremiumPayment", "premiumMargin", "delta", "gamma", "vega", "rho", "theta", "received", "clss",
            "underlying", "netLS", "netEA"
        ];
        vm.getTickFromRecord = getTickFromRecord;
        vm.getRestQueryUrl = getRestQueryUrl;
        vm.processData = processData;
        vm.loadData();

        function processData(data) {
            var index;
            for (index = 0; index < data.length; ++index) {
                data[index].netLS = data[index].crossMarginLongQty - data[index].crossMarginShortQty;
                data[index].netEA = (data[index].optionExcerciseQty - data[index].optionAssignmentQty) + (data[index].allocationTradeQty - data[index].deliveryNoticeQty);
            }
            vm.sourceData = data;
            vm.recordCount = data.length;
            vm.updateViewWindow(vm.currentPage);
            vm.processGraphData(data);
        }

        function getTickFromRecord(record) {
            var tick = {
                period: $filter('date')(record.received, "yyyy-MM-dd HH:mm:ss"),
                netLS: record.netLS,
                netEA: record.netEA,
                mVar: record.mVar,
                compVar: record.compVar,
                delta: record.delta,
                compLiquidityAddOn: record.compLiquidityAddOn
            };
            return tick;
        }

        function getRestQueryUrl() {
            return hostConfig.restURL + '/pr/history/' + vm.route.clearer + '/' + vm.route.member + '/' + vm.route.account + '/' + vm.route.class + '/' + vm.route.symbol + '/' + vm.route.putCall + '/' + vm.route.strikePrice + '/' + vm.route.optAttribute + "/" + vm.route.maturityMonthYear;
        }
    };
})();
