/**
 * Created by jakub on 20/10/2016.
 */

(function () {
    'use strict';

    angular.module('dave').controller('MarginComponentTreemapController', MarginComponentTreemapController);

    function MarginComponentTreemapController($scope, $http, $interval, $location, hostConfig) {
        var vm = this;
        vm.initialLoad = true;
        vm.errorMessage = "";
        vm.chartObject = {};
        vm.selectHandler = selectHandler;

        var refresh = $interval(loadData, 60000);
        var restQueryUrl = hostConfig.restURL + '/mc/latest/';

        loadData();

        function loadData() {
            $http.get(restQueryUrl).success(function (data) {
                processGraphData(data);
                vm.errorMessage = "";
                vm.initialLoad = false;
            }).error(function (data, status, headers, config) {
                vm.errorMessage = "Server returned status " + status;
                vm.initialLoad = false;
            });
        }

        function processGraphData(data) {
            var chartObject = {};
            chartObject.type = "TreeMap";
            chartObject.options = {
                backgroundColor: {
                    fill: 'transparent'
                },
                minColor: '#f39d3c',
                midColor: '#ec7a08',
                maxColor: '#b35c00',
                fontColor: 'black',
                showScale: false,
                highlightOnMouseOver: true,
                headerHeight: 15,
                maxDepth: 1,
                maxPostDepth: 1
            };
            chartObject.data = {
                cols: [{
                    id: 'aggregation',
                    type: 'string'
                }, {
                    id: 'parent',
                    type: 'string'
                }, {
                    id: 'margin',
                    type: 'number'
                }],
                rows: []
            };

            var index;
            var members = {};
            var accounts = {};
            var classes = {};
            var tree = new Tree({id: 'all', text: 'all', value: 0});

            for (index = 0; index < data.length; ++index) {
                if (data[index].additionalMargin === 0) continue;

                var clearer = data[index].clearer;
                var member = data[index].clearer + '-' + data[index].member;
                var account = data[index].clearer + '-' + data[index].member + '-' + data[index].account;
                var clss = data[index].clearer + '-' + data[index].member + '-' + data[index].account + '-' + data[index].clss;
                var ccy = data[index].clearer + '-' + data[index].member + '-' + data[index].account + '-' + data[index].clss + '-' + data[index].ccy;

                if (!(member in members)) {
                    members[member] = true;
                    tree.add({id: member, text: member.replace(/\w+-/, ""), value: 0, clearer: clearer}, 'all');
                }

                if (!(account in accounts)) {
                    accounts[account] = true;
                    tree.add({id: account, text: account.replace(/\w+-/, ""), value: 0, clearer: clearer}, member);
                }

                if (!(clss in classes)) {
                    classes[clss] = true;
                    tree.add({id: clss, text: clss.replace(/\w+-/, ""), value: 0, clearer: clearer}, account);
                }

                tree.add({
                    id: ccy,
                    text: ccy.replace(/\w+-/, ""),
                    value: data[index].additionalMargin,
                    clearer: clearer,
                    leaf: true
                }, clss);
            }
            tree.traverseDF(function (node) {
                node.children.sort(function (a, b) {
                    return b.data.value - a.data.value;
                });
            });
            tree.traverseBF(function (node) {
                var restNode = new Node({
                    id: node.data.id + "-Rest",
                    text: node.data.text + "-Rest",
                    value: 0,
                    clearer: node.data.clearer
                });
                restNode.parent = node;
                var aggregateCount = Math.max(node.children.length - 10, 0);
                for (var i = 0; i < aggregateCount; i++) {
                    var smallNode = node.children.pop();
                    restNode.data.value += smallNode.data.value;
                    restNode.children = restNode.children.concat(smallNode.children);
                    for (var j = 0; j < smallNode.children.length; j++) {
                        smallNode.children[j].parent = restNode;
                    }
                }
                if (aggregateCount > 0) {
                    node.children.push(restNode);
                }
            });
            tree.traverseDF(function (node) {
                chartObject.data.rows.push({
                    c: [{
                        v: node.data.text
                    }, {
                        v: node.parent !== null ? node.parent.data.text : null
                    }, {
                        v: node.children.length > 0 ? 0 : node.data.value
                    }
                    ], clearer: node.data.clearer, leaf: node.data.leaf
                });
            });
            vm.chartObject = chartObject;
        }

        function selectHandler(selectedItem) {
            var parentId = vm.chartObject.data.rows[selectedItem.row].c[1].v;
            var leaf = vm.chartObject.data.rows[selectedItem.row].leaf;
            var items = parentId.split("-");
            if ((typeof leaf !== 'undefined') && (leaf === true) && (!items.includes("Rest"))) {
                var clearer = vm.chartObject.data.rows[selectedItem.row].clearer;
                $location.path('/marginComponentLatest/' + clearer + "/" + items.join("/"));
            }
        }

        $scope.$on("$destroy", function () {
            if (refresh !== null) {
                $interval.cancel(refresh);
            }
        });

        function Node(data) {
            this.data = data;
            this.parent = null;
            this.children = [];
        }

        function Tree(data) {
            var node = new Node(data);
            this._root = node;
        }

        Tree.prototype.traverseDF = function (callback) {
            (function recurse(currentNode) {
                for (var i = 0, length = currentNode.children.length; i < length; i++) {
                    recurse(currentNode.children[i]);
                }
                callback(currentNode);
            })(this._root);
        };

        Tree.prototype.traverseBF = function (callback) {
            var queue = [];
            queue.push(this._root);
            var currentTree = queue.pop();
            while (currentTree) {
                callback(currentTree);
                for (var i = 0, length = currentTree.children.length; i < length; i++) {
                    queue.push(currentTree.children[i]);
                }
                currentTree = queue.pop();
            }
        };

        Tree.prototype.contains = function (callback) {
            this.traverseDF(callback);
        };

        Tree.prototype.add = function (data, parentId) {
            var child = new Node(data),
                parent = null,
                callback = function (node) {
                    if (node.data.id === parentId) {
                        parent = node;
                    }
                };
            this.contains(callback);
            if (parent) {
                parent.children.push(child);
                child.parent = parent;
                while (parent !== null) {
                    parent.data.value += child.data.value;
                    parent = parent.parent;
                }
            } else {
                throw new Error('Cannot add node to a non-existent parent.');
            }
        };

    };
})();