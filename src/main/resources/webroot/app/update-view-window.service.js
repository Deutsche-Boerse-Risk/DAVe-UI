/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').factory('updateViewWindowService', UpdateViewWindowService);

    function UpdateViewWindowService($filter) {
        return function (data, filter, ordering, page, pageSize) {
            if (filter !== null) {
                return $filter('orderBy')($filter('spacedFilter')(data, filter), ordering).slice(page * pageSize - pageSize, page * pageSize);
            }
            else {
                return $filter('orderBy')(data, ordering).slice(page * pageSize - pageSize, page * pageSize);
            }
        };
    };
})();