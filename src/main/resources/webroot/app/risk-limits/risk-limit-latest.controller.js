/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').controller('RiskLimitLatestController', RiskLimitLatestController);

    function RiskLimitLatestController($scope, $routeParams, $http, $interval, sortRecordsService, recordCountService, updateViewWindowService, showExtraInfoService, downloadAsCsvService, hostConfig) {
        BaseLatestController.call(this, $scope, $routeParams, $http, $interval, sortRecordsService, recordCountService, updateViewWindowService, showExtraInfoService, downloadAsCsvService);
        var vm = this;
        vm.route = {
            "clearer": "*",
            "member": "*",
            "maintainer": "*",
            "limitType": "*"
        };
        vm.defaultOrdering = ["-rejectUtil", "clearer", "member", "maintainer", "limitType"];
        vm.routingKeys = ["clearer", "member", "maintainer", "limitType"];
        vm.ordering = vm.defaultOrdering;
        vm.exportKeys = ["clearer", "member", "maintainer", "limitType", "utilization", "warningLevel", "warningUtil", "throttleLevel", "throttleUtil", "rejectLevel", "rejectUtil", "received"];
        vm.getRestQueryUrl = getRestQueryUrl;
        vm.processRecord = processRecord;

        vm.processRouting();
        vm.loadData();

        function processRecord(record) {
            record.functionalKey = record.clearer + '-' + record.member + '-' + record.maintainer + '-' + record.limitType;

            if (record.warningLevel > 0) {
                record.warningUtil = record.utilization / record.warningLevel * 100;
            }

            if (record.throttleLevel > 0) {
                record.throttleUtil = record.utilization / record.throttleLevel * 100;
            }

            if (record.rejectLevel > 0) {
                record.rejectUtil = record.utilization / record.rejectLevel * 100;
            }
        }

        function getRestQueryUrl() {
            return hostConfig.restURL + '/rl/latest/' + vm.route.clearer + '/' + vm.route.member + '/' + vm.route.maintainer + '/' + vm.route.limitType;
        }
    };
})();
