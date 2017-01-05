function BaseLatestController($scope, $routeParams, $http, $interval, sortRecordsService, recordCountService, updateViewWindowService, showExtraInfoService, downloadAsCsvService) {
    BaseController.call(this, $scope, $http, $interval, sortRecordsService, recordCountService, updateViewWindowService, showExtraInfoService, downloadAsCsvService)
    var vm = this;
    vm.filterQuery = "";
    vm.processRouting = processRouting;
    vm.processData = processData;

    function processRouting() {
        vm.routingKeys.forEach(function (entry) {
            if ($routeParams[entry]) {
                vm.route[entry] = $routeParams[entry];
            } else {
                vm.route[entry] = "*";
            }
        });
    }

    function processData(data) {
        var index;

        for (index = 0; index < data.length; ++index) {
            vm.processRecord(data[index]);
        }

        vm.sourceData = data;
        vm.filter();
        vm.updateViewWindow(vm.currentPage);
    }

}
