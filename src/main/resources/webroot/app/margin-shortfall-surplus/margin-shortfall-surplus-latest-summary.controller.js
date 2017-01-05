/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').controller('MarginShortfallSurplusLatestSummaryController', MarginShortfallSurplusLatestSummaryController);

    function MarginShortfallSurplusLatestSummaryController($scope, $http, $interval, hostConfig) {
        var vm = this;
        vm.initialLoad = true;
        vm.errorMessage = "";
        vm.viewSum = {
            "shortfallSurplus": 0,
            "marginRequirement": 0,
            "securityCollateral": 0,
            "cashBalance": 0,
            "marginCall": 0
        };

        var refresh = $interval(loadData, 60000);

        loadData();

        ////////////////////

        function loadData() {
            $http.get(getRestQueryUrl()).success(function (data) {
                processData(data);
                vm.errorMessage = "";
                vm.initialLoad = false;
            }).error(function (data, status, headers, config) {
                vm.errorMessage = "Server returned status " + status;
                vm.initialLoad = false;
            });
        }

        function processData(data) {
            var index;
            var sum = {
                "shortfallSurplus": 0,
                "marginRequirement": 0,
                "securityCollateral": 0,
                "cashBalance": 0,
                "marginCall": 0
            };

            for (index = 0; index < data.length; ++index) {
                sum.shortfallSurplus += data[index].shortfallSurplus;
                sum.marginRequirement += data[index].marginRequirement;
                sum.securityCollateral += data[index].securityCollateral;
                sum.cashBalance += data[index].cashBalance;
                sum.marginCall += data[index].marginCall;
            }

            vm.viewSum = sum;
        }

        function getRestQueryUrl() {
            return hostConfig.restURL + '/mss/latest/';
        }

        $scope.$on("$destroy", function () {
            if (refresh != null) {
                $interval.cancel(refresh);
            }
        });
    };
})();
