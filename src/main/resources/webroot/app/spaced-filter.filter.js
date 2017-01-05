/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').filter('spacedFilter', SpaceFilter);

    function SpaceFilter() {
        return function (items, filter) {
            if (filter) {
                var filters = filter.toLowerCase().split(" ");
                var index;
                var index2;
                var filteredItems = [];

                for (index = 0; index < items.length; index++) {
                    var match = true;

                    for (index2 = 0; index2 < filters.length; index2++) {
                        if (MatchObject(items[index], filters[index2]) == -1) {
                            match = false;
                            break;
                        }
                    }

                    if (match == true) {
                        filteredItems.push(items[index]);
                    }
                }

                return filteredItems;
            }
            else {
                return items;
            }

            function MatchObject(item, search) {
                for (var key in item) {
                    if (String(item[key]).toLowerCase().indexOf(search) != -1 && key !== "functionalKey") {
                        return 1;
                        break;
                    }
                }

                return -1;
            }
        };
    };
})();