/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').controller('MarginShortfallSurplusLatestController', MarginShortfallSurplusLatestController);

    function MarginShortfallSurplusLatestController($scope, $routeParams, $http, $interval, sortRecordsService, recordCountService, updateViewWindowService, showExtraInfoService, downloadAsCsvService, hostConfig) {
        BaseLatestController.call(this, $scope, $routeParams, $http, $interval, sortRecordsService, recordCountService, updateViewWindowService, showExtraInfoService, downloadAsCsvService);
        var vm = this;
        vm.route = {
            "clearer": "*",
            "pool": "*",
            "member": "*",
            "clearingCcy": "*"
        };
        vm.defaultOrdering = ["shortfallSurplus", "clearer", "pool", "member", "clearingCcy", "ccy"];
        vm.routingKeys = ["clearer", "pool", "member", "clearingCcy"];
        vm.ordering = vm.defaultOrdering;
        vm.exportKeys = ["clearer", "pool", "poolType", "member", "clearingCcy", "ccy", "bizDt", "marginRequirement", "securityCollateral", "cashBalance", "shortfallSurplus",
            "marginCall", "received"
        ];
        vm.getRestQueryUrl = getRestQueryUrl;
        vm.processRecord = processRecord;

        vm.processRouting();
        vm.loadData();

        function processRecord(record) {
            record.functionalKey = record.clearer + '-' + record.pool + '-' + record.member + '-' + record.clearingCcy + '-' + record.ccy;
        }

        function getRestQueryUrl() {
            return hostConfig.restURL + '/mss/latest/' + vm.route.clearer + '/' + vm.route.pool + '/' + vm.route.member + '/' + vm.route.clearingCcy;
        }
    };
})();
