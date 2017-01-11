import {Component, Input, OnChanges, QueryList, ContentChildren, TemplateRef} from '@angular/core';

import {DataTableColumnDirective} from './data.table.column.directive';
import {DataTableRowDetailDirective} from './data.table.row.detail.directive';
import {DataTableColumnGroupDirective} from './data.table.column.group.directive';

export interface DataTableColumn {
    title?: string;
    sortingKey?: string;
    tooltip?: string;
    cellTemplate?: TemplateRef<any>,
    footerTemplate?: TemplateRef<any>,
    rowspan?: number;
    colspan?: number;
}

interface DataTableDefinition {
    rowsTemplates: DataTableColumn[][];
    headerTemplates: DataTableColumn[][];
    footerTemplates: DataTableColumn[][];
}

@Component({
    moduleId: module.id,
    selector: 'data-table',
    templateUrl: 'data.table.component.html',
    styleUrls: ['../common.component.css']
})
export class DataTableComponent implements OnChanges {

    @Input()
    public data: any[];

    @Input()
    public footer: any;

    @Input()
    public pageSize: number;

    @Input()
    public defaultOrdering: string[];

    @Input()
    public striped: boolean = true;

    @Input()
    public showFooter: boolean = true;

    public pageRows: any[];

    private currentPage: number = 1;

    private ordering: string[];

    @ContentChildren(DataTableRowDetailDirective, {descendants: false})
    public _rowDetailTemplate: QueryList<DataTableRowDetailDirective>;

    @ContentChildren(DataTableColumnDirective, {descendants: false})
    public _columnTemplates: QueryList<DataTableColumnDirective>;

    private tableDefinition: DataTableDefinition;

    private rowDetailTableDefinitions: DataTableDefinition[];

    public ngOnChanges(): void {
        this.sort();
    }

    public updatePage(page: number) {
        if (!this.data) {
            return;
        }

        this.currentPage = page;
        if (!this.pageSize) {
            this.pageRows = this.data;
            return;
        }
        let firstIndex = (page - 1) * this.pageSize;
        let lastIndex = page * this.pageSize;
        this.pageRows = this.data.slice(firstIndex, lastIndex);
    }

    public sortRecords(sortingKey: string): void {
        if (!this.ordering) {
            this.ordering = [];
        }

        let defaultOrdering = this.defaultOrdering;
        if (!defaultOrdering) {
            defaultOrdering = [];
        }

        if (this.ordering[0] == sortingKey) {
            this.ordering = ['-' + sortingKey].concat(defaultOrdering);
        } else {
            this.ordering = [sortingKey].concat(defaultOrdering);
        }
        this.sort();
    }

    private sort(): void {
        if (!this.data) {
            return;
        }

        if (!this.ordering) {
            this.ordering = this.defaultOrdering;
        }

        if (!this.ordering) {
            this.ordering = [];
        }

        this.ordering.slice().reverse().forEach((sortingKey: string) => {
            let direction = 1;
            if (sortingKey.startsWith('-')) {
                sortingKey = sortingKey.slice(1);
                direction = -1
            }
            this.data.sort((a: any, b: any) => {
                let first = a[sortingKey];
                let second = b[sortingKey];

                if (first < second)
                    return -1 * direction;
                if (first > second)
                    return direction;
                return 0;
            });
        });
        this.updatePage(this.currentPage);
    }

    public get headerTemplates(): DataTableColumn[][] {
        if (this._columnTemplates && !this.tableDefinition) {
            this.tableDefinition = this.computeSpans(this._columnTemplates.toArray());
        }
        return this.tableDefinition.headerTemplates;
    }

    public get rowsTemplates(): DataTableColumn[][] {
        if (this._columnTemplates && !this.tableDefinition) {
            this.tableDefinition = this.computeSpans(this._columnTemplates.toArray());
        }
        return this.tableDefinition.rowsTemplates;
    }

    public get footerTemplates(): DataTableColumn[][] {
        if (this._columnTemplates && !this.tableDefinition) {
            this.tableDefinition = this.computeSpans(this._columnTemplates.toArray());
        }
        return this.tableDefinition.footerTemplates;
    }

    public get detailRowColspan(): number {
        let template: DataTableColumn[];
        if (this.headerTemplates && this.headerTemplates.length) {
            template = this.headerTemplates[0];
        } else if (this.rowsTemplates && this.rowsTemplates.length) {
            template = this.rowsTemplates[0];
        } else if (this.footerTemplates && this.footerTemplates.length) {
            template = this.footerTemplates[0];
        }

        if (template) {
            let colspan: number = 0;
            template.forEach((cell: DataTableColumn) => {
                if (cell.colspan) {
                    colspan += cell.colspan;
                } else {
                    colspan++;
                }
            });
            return colspan;
        }
        return 1;
    }

    public get detailRowGroups(): DataTableDefinition[] {
        if (this._rowDetailTemplate && this._rowDetailTemplate.first && !this.rowDetailTableDefinitions) {
            let detailTemplate: DataTableRowDetailDirective = this._rowDetailTemplate.first;
            let rowDetailTableDefinitions: DataTableDefinition[] = [];
            detailTemplate.columnGroups.forEach((item: DataTableColumnGroupDirective) => {
                rowDetailTableDefinitions.push(this.computeSpans(item.columns.toArray()));
            });
            if (!rowDetailTableDefinitions.length) {
                delete this.rowDetailTableDefinitions;
            } else {


                this.rowDetailTableDefinitions = rowDetailTableDefinitions;
            }
        }
        return this.rowDetailTableDefinitions;
    }

    private computeSpans(columnDirectives: DataTableColumnDirective[]): DataTableDefinition {
        return {
            headerTemplates: this.computeHeaderSpans(columnDirectives),
            rowsTemplates: this.computeRowSpans(columnDirectives),
            footerTemplates: this.computeFooterSpans(columnDirectives),
        }
    }

    private computeHeaderSpans(columnDirectives: DataTableColumnDirective[]): DataTableColumn[][] {
        let templates: DataTableColumn[][] = this.computeTemplate(columnDirectives,
            (columnDirective: DataTableColumnDirective) => {
                return !!columnDirective.title || !!columnDirective.sortingKey || !!columnDirective.tooltip;
            },
            (columnDirective: DataTableColumnDirective, index: number) => {
                return {
                    title: columnDirective.title,
                    sortingKey: columnDirective.sortingKey,
                    tooltip: columnDirective.tooltip
                }
            });

        if (templates) {
            let isAvailable = templates.some((template: DataTableColumn[]) => {
                return template.some((cell: DataTableColumn) => {
                    return !!cell.title || !!cell.sortingKey || !!cell.tooltip;
                });
            });
            if (isAvailable) {
                return templates;
            }
        }
    }

    private computeRowSpans(columnDirectives: DataTableColumnDirective[]): DataTableColumn[][] {
        let templates: DataTableColumn[][] = this.computeTemplate(columnDirectives,
            (columnDirective: DataTableColumnDirective) => {
                let cellTemplate: TemplateRef<any>;
                if (columnDirective.cellTemplate && columnDirective.cellTemplate.length) {
                    cellTemplate = columnDirective.cellTemplate.first;
                }
                return !!cellTemplate;
            },
            (columnDirective: DataTableColumnDirective, index: number) => {
                let cellTemplate: TemplateRef<any>;
                if (columnDirective.cellTemplate && columnDirective.cellTemplate.length) {
                    cellTemplate = columnDirective.cellTemplate.first;
                }
                return {
                    cellTemplate: cellTemplate
                }
            });

        if (templates) {
            let isAvailable = templates.some((template: DataTableColumn[]) => {
                return template.some((cell: DataTableColumn) => {
                    return !!cell.cellTemplate;
                });
            });
            if (isAvailable) {
                return templates;
            }
        }
    }

    private computeFooterSpans(columnDirectives: DataTableColumnDirective[]): DataTableColumn[][] {
        let templates: DataTableColumn[][] = this.computeTemplate(columnDirectives,
            (columnDirective: DataTableColumnDirective) => {
                let footerTemplate: TemplateRef<any>;
                if (columnDirective.footerTemplate && columnDirective.footerTemplate.length) {
                    footerTemplate = columnDirective.footerTemplate.first;
                }
                return !!footerTemplate;
            },
            (columnDirective: DataTableColumnDirective, index: number) => {
                let footerTemplate: TemplateRef<any>;
                if (columnDirective.footerTemplate && columnDirective.footerTemplate.length) {
                    footerTemplate = columnDirective.footerTemplate.first;
                }
                return {
                    footerTemplate: footerTemplate
                }
            });

        if (templates) {
            let isAvailable = templates.some((template: DataTableColumn[]) => {
                return template.some((cell: DataTableColumn) => {
                    return !!cell.footerTemplate;
                });
            });
            if (isAvailable) {
                return templates;
            }
        }
    }

    private computeTemplate(columnDirectives: DataTableColumnDirective[],
                            hasCell: (columnDirective: DataTableColumnDirective, index: number)
                                => boolean,
                            getCell: (columnDirective: DataTableColumnDirective, index: number)
                                => DataTableColumn): DataTableColumn[][] {
        let flatSubColumnsDataTableColumn: DataTableColumn[][][] = [];
        let maxDepth = 0;
        columnDirectives.forEach((columnDirective: DataTableColumnDirective) => {
            let subColumns: DataTableColumn[][] = this.computeTemplate(columnDirective.subColumns.toArray().slice(1),
                hasCell, getCell);
            if (subColumns && subColumns.length) {
                flatSubColumnsDataTableColumn.push(subColumns);
                maxDepth = Math.max(maxDepth, subColumns.length);
            } else {
                flatSubColumnsDataTableColumn.push(null);
            }
        });

        if (!columnDirectives || !columnDirectives.length) {
            return;
        }

        let result: DataTableColumn[][] = [[]];
        columnDirectives.forEach((columnDirective: DataTableColumnDirective, index: number) => {
            if (hasCell(columnDirective, index)) {
                let cell: DataTableColumn = getCell(columnDirective, index);
                cell.rowspan = this.computeRowspan(maxDepth + 1, flatSubColumnsDataTableColumn[index]);
                cell.colspan = this.computeColspan(columnDirective);
                result[0].push(cell);
            } else if (flatSubColumnsDataTableColumn[index]) {
                // Merge cells from next row if needed
                result[0] = result[0].concat(flatSubColumnsDataTableColumn[index][0]);
                if (flatSubColumnsDataTableColumn[index].length > 1) {
                    flatSubColumnsDataTableColumn[index] = flatSubColumnsDataTableColumn[index].slice(1);
                } else {
                    flatSubColumnsDataTableColumn[index] = null;
                }
            } else {
                result[0].push({
                    rowspan: this.computeRowspan(maxDepth + 1, flatSubColumnsDataTableColumn[index]),
                    colspan: this.computeColspan(columnDirective)
                });
            }
        });

        // Compute new depth after merging cells
        let newDepth = 0;
        flatSubColumnsDataTableColumn.forEach((flatSubColumnsDataTable: DataTableColumn[][]) => {
            if (flatSubColumnsDataTable) {
                newDepth = Math.max(newDepth, flatSubColumnsDataTable.length);
            }
        });

        // Fix rowspans after merging cells
        result[0].forEach((cell: DataTableColumn) => {
            if (cell.rowspan) {
                cell.rowspan = cell.rowspan - (maxDepth - newDepth);
                if (cell.rowspan < 1) {
                    cell.rowspan = null;
                }
            }
        });

        // remove if empty
        if (!result[0].length) {
            result = [];
        }

        // Process sub tables
        for (let i = 0; i < maxDepth; i++) {
            result.push([]);
            flatSubColumnsDataTableColumn.forEach((flatSubColumnsDataTable: DataTableColumn[][]) => {
                if (flatSubColumnsDataTable && flatSubColumnsDataTable[i]) {
                    result.push(result.pop().concat(flatSubColumnsDataTable[i]));
                }
            });

            // remove if empty
            if (!result[result.length - 1].length) {
                result.pop();
            }
        }

        if (result.length) {
            return result;
        }
    }

    private computeColspan(columnDirective: DataTableColumnDirective): number {
        let subColumns: DataTableColumnDirective[] = columnDirective.subColumns.toArray().slice(1);
        if (subColumns.length > 1) {
            return subColumns.length;
        }
    }

    private computeRowspan(rowspan: number, flatSubColumns: DataTableColumn[][]): number {
        if (flatSubColumns) {
            rowspan = rowspan - flatSubColumns.length;
        }
        if (rowspan > 1) {
            return rowspan;
        }
    }
}

