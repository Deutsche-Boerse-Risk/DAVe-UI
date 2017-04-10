import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AbstractComponentWithAutoRefresh} from '../abstract.component';
import {ErrorResponse} from '../http.service';

import {ChartData, TreeMapOptions, ChartRow, SelectionEvent} from '../common/chart.types';

import {LiquiGroupMarginService} from './liqui.group.margin.service';
import {LiquiGroupMarginTree, LiquiGroupMarginTreeNode} from './liqui.group.margin.types';

@Component({
    moduleId   : module.id,
    selector   : 'liqui-group-margin-treemap',
    templateUrl: 'liqui.group.margin.treemap.component.html',
    styleUrls  : ['../common.component.css']
})
export class LiquiGroupMarginTreemapComponent extends AbstractComponentWithAutoRefresh {

    public initialLoad: boolean = true;

    public errorMessage: string;

    public chartOptions: TreeMapOptions = {
        minColor            : '#f39d3c',
        midColor            : '#ec7a08',
        maxColor            : '#b35c00',
        fontColor           : 'black',
        showScale           : false,
        highlightOnMouseOver: true,
        headerHeight        : 15,
        maxDepth            : 1,
        maxPostDepth        : 1
    };

    public chartData: ChartData;

    constructor(private liquiGroupMarginService: LiquiGroupMarginService,
        private router: Router) {
        super();
    }

    protected loadData(): void {
        this.liquiGroupMarginService.getLiquiGroupMarginTreeMapData().subscribe(
            (tree: LiquiGroupMarginTree) => {
                this.chartData = {
                    cols: [
                        {
                            id  : 'aggregation',
                            type: 'string'
                        }, {
                            id  : 'parent',
                            type: 'string'
                        }, {
                            id  : 'margin',
                            type: 'number'
                        }
                    ],
                    rows: []
                };

                tree.traverseDF((node: LiquiGroupMarginTreeNode) => {
                    this.chartData.rows.push({
                        c           : [
                            {
                                v: node.data.text
                            },
                            {
                                v: node.parent ? node.parent.data.text : null
                            },
                            {
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

        let node: LiquiGroupMarginTreeNode = row.originalData;
        if (node && node.data.leaf
            && node.parent && node.parent.data.text.indexOf('Rest') === -1) {
            this.router.navigate([
                this.rootRoutePath,
                node.parent.data.clearer || '*',
                node.parent.data.member || '*',
                node.parent.data.account || '*',
                node.parent.data.marginClass || '*',
                node.parent.data.marginCurrency || '*'
            ]);
        }
    }

    public get rootRoutePath(): string {
        return this.routerRoots.LIQUI_GROUP_MARGIN_LATEST;
    }
}
