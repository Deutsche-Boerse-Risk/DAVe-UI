import {Directive, Input, ContentChild, TemplateRef, QueryList, ContentChildren} from '@angular/core';

import {DataTableColumnCellDirective} from './data.table.column.cell.directive';
import {DataTableColumnFooterDirective} from './data.table.column.footer.directive';

@Directive({
    selector: 'column'
})
export class DataTableColumnDirective {

    @Input()
    public title: string;

    @Input()
    public sortingKey: string;

    @Input()
    public tooltip: string;

    @ContentChildren(DataTableColumnDirective)
    public subColumns: QueryList<DataTableColumnDirective>;

    @ContentChild(DataTableColumnCellDirective, {read: TemplateRef})
    public cellTemplate: TemplateRef<any>;

    @ContentChild(DataTableColumnFooterDirective, {read: TemplateRef})
    public footerTemplate: TemplateRef<any>;
}