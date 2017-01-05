/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').factory('recordCountService', RecordCountService);

    function RecordCountService($filter) {
        return function (data, filter) {
            return $filter('spacedFilter')(data, filter).length;
        };
    };
})();