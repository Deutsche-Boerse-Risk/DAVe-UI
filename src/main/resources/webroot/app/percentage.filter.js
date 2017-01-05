/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').filter('percentage', PercentageFilter);

    function PercentageFilter($filter) {
        return function (number, fractionSize) {
            if (number == null) {
                return "";
            }
            else {
                return $filter('number')(number, fractionSize) + "%";
            }
        };
    }
})();