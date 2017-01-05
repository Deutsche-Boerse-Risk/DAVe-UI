function BaseController($scope, $http, $interval, sortRecordsService, recordCountService, updateViewWindowService, showExtraInfoService, downloadAsCsvService) {
    var vm = this;
    vm.initialLoad = true;
    vm.recordCount = 0;
    vm.errorMessage = "";
    vm.pageSize = 20;
    vm.currentPage = 1;
    vm.viewWindow = [];
    vm.sourceData = [];
    vm.filterQuery = "";
    vm.loadData = loadData;
    vm.updateViewWindow = updateViewWindow;
    vm.sortRecords = sortRecords;
    vm.filter = filter;
    vm.showExtraInfo = showExtraInfo;
    vm.downloadAsCsv = downloadAsCsv;

    var refresh = $interval(vm.loadData, 60000);

    function loadData() {
        $http.get(vm.getRestQueryUrl()).success(function (data) {
            vm.processData(data);
            vm.errorMessage = "";
            vm.initialLoad = false;
        }).error(function (data, status, headers, config) {
            vm.errorMessage = "Server returned status " + status;
            vm.initialLoad = false;
        });
    }

    function updateViewWindow(page) {
        vm.currentPage = page;
        vm.viewWindow = updateViewWindowService(vm.sourceData, vm.filterQuery, vm.ordering, vm.currentPage, vm.pageSize);
    }

    function sortRecords(column) {
        vm.ordering = sortRecordsService(column, vm.ordering, vm.defaultOrdering);
        vm.updateViewWindow(vm.currentPage);
    }

    function filter() {
        vm.recordCount = recordCountService(vm.sourceData, vm.filterQuery);
        vm.updateViewWindow(vm.currentPage);
    }

    function showExtraInfo(funcKey) {
        showExtraInfoService(funcKey);
    }


    function downloadAsCsv() {
        downloadAsCsvService("download.csv", vm.sourceData, vm.exportKeys);
    }

    $scope.$on("$destroy", function () {
        if (refresh != null) {
            $interval.cancel(refresh);
        }
    });
}
