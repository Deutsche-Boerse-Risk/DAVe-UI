/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').directive('highlighter', HighlighterDirective);

    function HighlighterDirective($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.highlighter, function (nv, ov) {
                    //console.log("Triggering highlighter: " + ov + " vs " + nv)
                    element.hasClass("");
                    if (nv !== ov) {
                        element.addClass('bg-warning');

                        $timeout(function () {
                            element.removeClass('bg-warning');
                        }, 15000);
                    }
                });
            }
        };
    };
})();