import {Directive, Input, TemplateRef, QueryList, ContentChildren} from '@angular/core';

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

    @ContentChildren(DataTableColumnDirective, {descendants: false})
    public subColumns: QueryList<DataTableColumnDirective>;

    @ContentChildren(DataTableColumnCellDirective, {read: TemplateRef, descendants: false})
    public cellTemplate: QueryList<TemplateRef<any>>;

    @ContentChildren(DataTableColumnFooterDirective, {read: TemplateRef, descendants: false})
    public footerTemplate: QueryList<TemplateRef<any>>;
}