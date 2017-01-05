/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').filter('nullHandler', NullHandlerFilter);

    function NullHandlerFilter() {
        return function (item, subst) {
            subst = subst || "null";
            item = item || subst;

            return item;
        };
    }
})();