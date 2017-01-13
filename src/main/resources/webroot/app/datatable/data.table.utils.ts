import {TemplateRef} from '@angular/core';

import {DataTableColumnDirective} from './data.table.column.directive';

export interface DataTableCell {
    title?: string;
    sortingKey?: string;
    tooltip?: string;
    cellTemplate?: TemplateRef<any>,
    footerTemplate?: TemplateRef<any>,
    rowspan?: number;
    colspan?: number;
}

export interface DataTableDefinition {
    rowsTemplates: DataTableCell[][];
    headerTemplates: DataTableCell[][];
    footerTemplates: DataTableCell[][];
}

export abstract class DataTableUtils {

    public static fixColspans(definitions: DataTableDefinition[], desiredColumnsCount: number): void {
        if (definitions.length > 0) {
            definitions.forEach((definition: DataTableDefinition) => {
                let columnsCountForTemplate = DataTableUtils.getColumnsCountForTemplate(definition);
                if (columnsCountForTemplate < desiredColumnsCount) {
                    if (definition.headerTemplates && definition.headerTemplates.length) {
                        DataTableUtils.changeColspan(definition.headerTemplates[0],
                            desiredColumnsCount - columnsCountForTemplate);
                    }
                    if (definition.rowsTemplates && definition.rowsTemplates.length) {
                        DataTableUtils.changeColspan(definition.rowsTemplates[0],
                            desiredColumnsCount - columnsCountForTemplate);
                    }
                    if (definition.footerTemplates && definition.footerTemplates.length) {
                        DataTableUtils.changeColspan(definition.footerTemplates[0],
                            desiredColumnsCount - columnsCountForTemplate);
                    }
                }
            });
        }
    }

    public static  getColumnsCountForTemplate(definition: DataTableDefinition): number {
        let template: DataTableCell[];
        if (definition.headerTemplates && definition.headerTemplates.length) {
            template = definition.headerTemplates[0];
        } else if (definition.rowsTemplates && definition.rowsTemplates.length) {
            template = definition.rowsTemplates[0];
        } else if (definition.footerTemplates && definition.footerTemplates.length) {
            template = definition.footerTemplates[0];
        }

        if (template) {
            let colspan: number = 0;
            template.forEach((cell: DataTableCell) => {
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

    public static computeSpans(columnDirectives: DataTableColumnDirective[]): DataTableDefinition {
        return {
            headerTemplates: DataTableUtils.computeHeaderSpans(columnDirectives),
            rowsTemplates: DataTableUtils.computeRowSpans(columnDirectives),
            footerTemplates: DataTableUtils.computeFooterSpans(columnDirectives),
        }
    }

    private static computeHeaderSpans(columnDirectives: DataTableColumnDirective[]): DataTableCell[][] {
        let templates: DataTableCell[][] = DataTableUtils.computeTemplate(columnDirectives,
            (columnDirective: DataTableColumnDirective) => {
                return !!columnDirective.title || !!columnDirective.sortingKey || !!columnDirective.tooltip;
            },
            (columnDirective: DataTableColumnDirective) => {
                return {
                    title: columnDirective.title,
                    sortingKey: columnDirective.sortingKey,
                    tooltip: columnDirective.tooltip
                }
            });

        if (templates) {
            let isAvailable = templates.some((template: DataTableCell[]) => {
                return template.some((cell: DataTableCell) => {
                    return !!cell.title || !!cell.sortingKey || !!cell.tooltip;
                });
            });
            if (isAvailable) {
                return templates;
            }
        }
        return null;
    }

    private static computeRowSpans(columnDirectives: DataTableColumnDirective[]): DataTableCell[][] {
        let templates: DataTableCell[][] = DataTableUtils.computeTemplate(columnDirectives,
            (columnDirective: DataTableColumnDirective) => {
                let cellTemplate: TemplateRef<any>;
                if (columnDirective.cellTemplate && columnDirective.cellTemplate.length) {
                    cellTemplate = columnDirective.cellTemplate.first;
                }
                return !!cellTemplate;
            },
            (columnDirective: DataTableColumnDirective) => {
                let cellTemplate: TemplateRef<any>;
                if (columnDirective.cellTemplate && columnDirective.cellTemplate.length) {
                    cellTemplate = columnDirective.cellTemplate.first;
                }
                return {
                    cellTemplate: cellTemplate
                }
            });

        if (templates) {
            let isAvailable = templates.some((template: DataTableCell[]) => {
                return template.some((cell: DataTableCell) => {
                    return !!cell.cellTemplate;
                });
            });
            if (isAvailable) {
                return templates;
            }
        }
        return null;
    }

    private static computeFooterSpans(columnDirectives: DataTableColumnDirective[]): DataTableCell[][] {
        let templates: DataTableCell[][] = DataTableUtils.computeTemplate(columnDirectives,
            (columnDirective: DataTableColumnDirective) => {
                let footerTemplate: TemplateRef<any>;
                if (columnDirective.footerTemplate && columnDirective.footerTemplate.length) {
                    footerTemplate = columnDirective.footerTemplate.first;
                }
                return !!footerTemplate;
            },
            (columnDirective: DataTableColumnDirective) => {
                let footerTemplate: TemplateRef<any>;
                if (columnDirective.footerTemplate && columnDirective.footerTemplate.length) {
                    footerTemplate = columnDirective.footerTemplate.first;
                }
                return {
                    footerTemplate: footerTemplate
                }
            });

        if (templates) {
            let isAvailable = templates.some((template: DataTableCell[]) => {
                return template.some((cell: DataTableCell) => {
                    return !!cell.footerTemplate;
                });
            });
            if (isAvailable) {
                return templates;
            }
        }
        return null;
    }

    private static computeTemplate(columnDirectives: DataTableColumnDirective[],
                                   hasCell: (columnDirective: DataTableColumnDirective, index: number)
                                       => boolean,
                                   getCell: (columnDirective: DataTableColumnDirective, index: number)
                                       => DataTableCell): DataTableCell[][] {
        let flatSubColumnsDataTableColumn: DataTableCell[][][] = [];
        let maxDepth = 0;
        columnDirectives.forEach((columnDirective: DataTableColumnDirective) => {
            let subColumns: DataTableCell[][] = DataTableUtils.computeTemplate(columnDirective.subColumns.toArray().slice(1),
                hasCell, getCell);
            if (subColumns && subColumns.length) {
                flatSubColumnsDataTableColumn.push(subColumns);
                maxDepth = Math.max(maxDepth, subColumns.length);
            } else {
                flatSubColumnsDataTableColumn.push(null);
            }
        });

        if (!columnDirectives || !columnDirectives.length) {
            return null;
        }

        let result: DataTableCell[][] = [[]];
        columnDirectives.forEach((columnDirective: DataTableColumnDirective, index: number) => {
            if (hasCell(columnDirective, index)) {
                let cell: DataTableCell = getCell(columnDirective, index);
                cell.rowspan = DataTableUtils.computeRowspan(maxDepth + 1, flatSubColumnsDataTableColumn[index]);
                cell.colspan = DataTableUtils.computeColspan(columnDirective);
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
                    rowspan: DataTableUtils.computeRowspan(maxDepth + 1, flatSubColumnsDataTableColumn[index]),
                    colspan: DataTableUtils.computeColspan(columnDirective)
                });
            }
        });

        // Compute new depth after merging cells
        let newDepth = 0;
        flatSubColumnsDataTableColumn.forEach((flatSubColumnsDataTable: DataTableCell[][]) => {
            if (flatSubColumnsDataTable) {
                newDepth = Math.max(newDepth, flatSubColumnsDataTable.length);
            }
        });

        // Fix rowspans after merging cells
        result[0].forEach((cell: DataTableCell) => {
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
            flatSubColumnsDataTableColumn.forEach((flatSubColumnsDataTable: DataTableCell[][]) => {
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
        return null;
    }

    private static  computeColspan(columnDirective: DataTableColumnDirective): number {
        let subColumns: DataTableColumnDirective[] = columnDirective.subColumns.toArray().slice(1);
        if (subColumns.length > 1) {
            return subColumns.length;
        }
        return null;
    }

    private static  computeRowspan(rowspan: number, flatSubColumns: DataTableCell[][]): number {
        if (flatSubColumns) {
            rowspan = rowspan - flatSubColumns.length;
        }
        if (rowspan > 1) {
            return rowspan;
        }
        return null;
    }

    private static changeColspan(template: DataTableCell[], diffColspan: number): void {
        if (template && template.length) {
            let lastCell: DataTableCell = template[template.length - 1];
            if (lastCell.colspan) {
                lastCell.colspan += diffColspan;
            } else {
                lastCell.colspan = diffColspan + 1;
            }
        }
    }
}