import {Component} from '@angular/core';
import {Router} from "@angular/router";

import {AbstractComponentWithAutoRefresh} from "../abstract.component";
import {ErrorResponse} from "../http.service";

import {ChartData, TreeMapOptions, ChartRow, SelectionEvent} from '../common/chart.types';

import {MarginComponentsService} from "./margin.components.service";
import {MarginComponentsTree, MarginComponentsTreeNode} from "./margin.types";

@Component({
    moduleId: module.id,
    selector: 'margin-components-treemap',
    templateUrl: 'margin.components.treemap.component.html',
    styleUrls: ['../common.component.css']
})
export class MarginComponentsTreemapComponent extends AbstractComponentWithAutoRefresh {

    public initialLoad: boolean = true;

    public errorMessage: string;

    public chartOptions: TreeMapOptions = {
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

    public chartData: ChartData;

    constructor(private marginComponentsService: MarginComponentsService,
                private router: Router) {
        super();
    }

    protected loadData(): void {
        this.marginComponentsService.getMarginComponentsTreeMapData().subscribe(
            (tree: MarginComponentsTree) => {
                this.chartData = {
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

                tree.traverseDF((node: MarginComponentsTreeNode) => {
                    this.chartData.rows.push({
                        c: [
                            {
                                v: node.data.text
                            }, {
                                v: !!node.parent ? node.parent.data.text : null
                            }, {
                                v: node.children.length > 0 ? 0 : node.data.value
                            }
                        ],
                        originalData: node
                    });
                });

                delete this.errorMessage;
                this.initialLoad = false;
            },
            (err: ErrorResponse) => {
                this.errorMessage = 'Server returned status ' + err.status;
                this.initialLoad = false;
            });
    }

    public selectHandler(selectionEvent: SelectionEvent) {
        let row: ChartRow = this.chartData.rows[selectionEvent[0].row];

        let node: MarginComponentsTreeNode = row.originalData;
        if (node && node.data.leaf
            && node.parent && node.parent.data.text.indexOf("Rest") === -1) {
            this.router.navigate([
                '/marginComponentLatest',
                node.parent.data.clearer || '*',
                node.parent.data.member || '*',
                node.parent.data.account || '*',
                node.parent.data.clss || '*',
                node.parent.data.ccy || '*'
            ]);
        }
    }
}
