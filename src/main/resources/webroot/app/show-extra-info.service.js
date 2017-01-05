/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').factory('showExtraInfoService', ShowExtraInfoService);

    function ShowExtraInfoService($filter) {
        return function (key) {
            var extra = $("#extra-" + key);
            var extraIcon = $("#extra-icon-" + key);

            if (extra.hasClass("hidden")) {
                extra.removeClass("hidden");
                extraIcon.removeClass("fa-chevron-circle-down");
                extraIcon.addClass("fa-chevron-circle-up");
            }
            else {
                extra.addClass("hidden");
                extraIcon.removeClass("fa-chevron-circle-up");
                extraIcon.addClass("fa-chevron-circle-down");
            }
        };
    };
})();