/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').controller('TotalMarginRequirementTreemapController', TotalMarginRequirementTreemapController);

    function TotalMarginRequirementTreemapController($scope, $http, $interval, hostConfig) {
        var vm = this;
        vm.initialLoad = true;
        vm.errorMessage = "";
        vm.chartObject = {};

        var refresh = $interval(loadData, 60000);
        var restQueryUrl = hostConfig.restURL + '/tmr/latest/';

        loadData();

        ////////////////////

        function loadData() {
            $http.get(restQueryUrl).success(function (data) {
                processGraphData(data);
                vm.errorMessage = "";
                vm.initialLoad = false;
            }).error(function (data, status, headers, config) {
                vm.errorMessage = "Server returned status " + status;
                vm.initialLoad = false;
            });
        }

        function processGraphData(data) {
            var chartObject = {};
            chartObject.type = "TreeMap";
            chartObject.options = {
                backgroundColor: {
                    fill: 'transparent'
                },
                minColor: '#63be78',
                //midColor: '#ddd',
                maxColor: '#FA6969',
                fontColor: 'black',
                showScale: false,
                highlightOnMouseOver: true,
                headerHeight: 15,
                maxDepth: 1,
                maxPostDepth: 2
            };
            chartObject.data = {
                cols: [{
                    id: 'aggregation',
                    type: 'string'
                }, {
                    id: 'parent',
                    type: 'string'
                }, {
                    id: 'margin',
                    type: 'number'
                }],
                rows: [
                    {
                        c: [{
                            v: 'all'
                        }, {
                            v: null
                        }, {
                            v: 0
                        }]
                    }]
            };

            var index;
            var accounts = [];
            var members = [];
            var pools = [];

            for (index = 0; index < data.length; ++index) {
                if (data[index].adjustedMargin === 0) continue;

                var ccy = data[index].clearer + '-' + data[index].pool + '-' + data[index].member + '-' + data[index].account + '-' + data[index].ccy;
                var account = data[index].clearer + '-' + data[index].pool + '-' + data[index].member + '-' + data[index].account;
                var member = data[index].clearer + '-' + data[index].pool + '-' + data[index].member;
                var pool = data[index].clearer + '-' + data[index].pool;

                chartObject.data.rows.push({
                    c: [{
                        v: ccy
                    }, {
                        v: account
                    }, {
                        v: data[index].adjustedMargin
                    }
                    ]
                });

                if ($.inArray(account, accounts) === -1) {
                    chartObject.data.rows.push({
                        c: [{
                            v: account
                        }, {
                            v: member
                        }, {
                            v: 0
                        }
                        ]
                    });

                    accounts.push(account);
                }

                if ($.inArray(member, members) === -1) {
                    chartObject.data.rows.push({
                        c: [{
                            v: member
                        }, {
                            v: pool
                        }, {
                            v: 0
                        }
                        ]
                    });

                    members.push(member);
                }

                if ($.inArray(pool, pools) === -1) {
                    chartObject.data.rows.push({
                        c: [{
                            v: pool
                        }, {
                            v: 'all'
                        }, {
                            v: 0
                        }
                        ]
                    });

                    pools.push(pool);
                }
            }

            vm.chartObject = chartObject;
        }

        $scope.$on("$destroy", function () {
            if (refresh != null) {
                $interval.cancel(refresh);
            }
        });
    };
})();