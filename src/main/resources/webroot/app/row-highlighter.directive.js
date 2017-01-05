/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').directive('rowHighlighter', RowHighlighterDirective);

    function RowHighlighterDirective($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var existingRecords = []

                scope.$watch(attrs.rowHighlighter, function (nv, ov) {
                    if ($.inArray(nv, existingRecords) === -1) {
                        existingRecords.push(nv);
                        $(element).children().each(function (index, child) {
                            $(child).addClass('bg-warning');
                        });

                        $timeout(function () {
                            $(element).children().each(function (index, child) {
                                $(child).removeClass('bg-warning');
                            });
                        }, 15000);
                    }
                });
            }
        };
    };
})();