/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').factory('sortRecordsService', SortRecordsService);

    function SortRecordsService() {
        return function (column, ordering, defaultOrdering) {
            if (ordering[0] == column) {
                return ["-" + column].concat(defaultOrdering);
            }
            else {
                return [column].concat(defaultOrdering);
            }
        };
    };
})();