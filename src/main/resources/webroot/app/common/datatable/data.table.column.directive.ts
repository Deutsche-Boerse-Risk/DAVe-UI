import {Directive, Input, ContentChild, TemplateRef} from '@angular/core';

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

    @Input()
    public rowspan: number;

    @Input()
    public colspan: number;

    @Input()
    @ContentChild(DataTableColumnCellDirective, {read: TemplateRef})
    public cellTemplate: TemplateRef<any>;

    @Input()
    @ContentChild(DataTableColumnFooterDirective, {read: TemplateRef})
    public footerTemplate: TemplateRef<any>;
}