import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-common';
import {ChartData, ChartRow, SelectionEvent, TreeMapOptions} from '@dbg-riskit/dave-ui-charts';
import {PercentPipe} from '@dbg-riskit/dave-ui-view';

import {AbstractComponent} from '../abstract.component';

import {LiquiGroupMarginService} from './liqui.group.margin.service';
import {LiquiGroupMarginTree, LiquiGroupMarginTreeNode} from './liqui.group.margin.types';

import {Subscription} from 'rxjs/Subscription';

@Component({
    moduleId   : module.id,
    templateUrl: 'liqui.group.margin.treemap.component.html',
    styleUrls  : [
        '../../' + COMPONENT_CSS,
        'liqui.group.margin.treemap.component.css'
    ]
})
export class LiquiGroupMarginTreemapComponent extends AbstractComponent {

    @Input()
    public chartShown: boolean = true;

    public initialLoad: boolean = true;

    public chartOptions: TreeMapOptions = {
        headerColor         : '#000099',
        headerHighlightColor: '#000099',
        minColor            : '#7DCDFF',
        midColor            : '#7DCDFF',
        maxColor            : '#7DCDFF',
        minHighlightColor   : '#D7EBFF',
        midHighlightColor   : '#D7EBFF',
        maxHighlightColor   : '#D7EBFF',
        fontColor           : 'black',
        showScale           : false,
        showTooltips        : true,
        highlightOnMouseOver: true,
        headerHeight        : 15,
        maxDepth            : 1,
        maxPostDepth        : 1,
        generateTooltip     : row => {
            let r = this.chartData.rows[row];
            return `<div class="treeMapTooltip">
                        ${r.c[0].f}
                    </div>`;
        }
    };

    public chartData: ChartData;

    constructor(private liquiGroupMarginService: LiquiGroupMarginService,
        private router: Router, private percentPipe: PercentPipe) {
        super();
    }

    protected loadData(): Subscription {
        return this.liquiGroupMarginService.getLiquiGroupMarginTreeMapData().subscribe(
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

                tree.traverseBF((node: LiquiGroupMarginTreeNode) => {
                    node.data.formattedText = `${node.data.text} (${this.percentPipe.transform(
                        (node.data.additionalMargin / tree.totalAdditionalMargin) * 100, '.1-1')})`;
                    this.chartData.rows.push({
                        c           : [
                            {
                                v: node.data.id,
                                f: node.data.formattedText
                            },
                            {
                                v: node.parent ? node.parent.data.id : null
                            },
                            {
                                v: node.children.length > 0 ? 0 : node.data.additionalMargin
                            }
                        ],
                        originalData: node
                    });
                });

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
                node.parent.data.marginClass || '*'
            ]);
        }
    }

    public get rootRoutePath(): string {
        return this.routerRoots.LIQUI_GROUP_MARGIN_LATEST;
    }
}
