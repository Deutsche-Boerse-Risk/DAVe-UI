/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').controller('TotalMarginRequirementHistoryController', TotalMarginRequirementHistoryController);

    function TotalMarginRequirementHistoryController($scope, $routeParams, $http, $interval, $filter, sortRecordsService, recordCountService, updateViewWindowService, showExtraInfoService, downloadAsCsvService, hostConfig) {
        BaseHistoryController.call(this, $scope, $http, $interval, sortRecordsService, recordCountService, updateViewWindowService, showExtraInfoService, downloadAsCsvService);
        var vm = this;
        vm.route = {
            "clearer": $routeParams.clearer,
            "pool": $routeParams.pool,
            "member": $routeParams.member,
            "account": $routeParams.account,
            "ccy": $routeParams.ccy
        };
        vm.defaultOrdering = ["-received"];
        vm.ordering = vm.defaultOrdering;
        vm.exportKeys = ["clearer", "pool", "member", "account", "ccy", "bizDt", "unadjustedMargin", "adjustedMargin", "received"];
        vm.getTickFromRecord = getTickFromRecord;
        vm.getRestQueryUrl = getRestQueryUrl;
        vm.loadData();

        function getTickFromRecord(record) {
            var tick = {
                period: $filter('date')(record.received, "yyyy-MM-dd HH:mm:ss"),
                adjustedMargin: record.adjustedMargin,
                unadjustedMargin: record.unadjustedMargin
            };
            return tick;
        }

        function getRestQueryUrl() {
            return hostConfig.restURL + '/tmr/history/' + vm.route.clearer + '/' + vm.route.pool + '/' + vm.route.member + '/' + vm.route.account + '/' + vm.route.ccy;
        }
    };
})();
