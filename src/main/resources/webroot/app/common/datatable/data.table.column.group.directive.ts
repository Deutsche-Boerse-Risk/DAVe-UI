import {Directive, ContentChildren, QueryList} from '@angular/core';

import {DataTableColumnDirective} from './data.table.column.directive';

@Directive({
    selector: 'column-group'
})
export class DataTableColumnGroupDirective {

    @ContentChildren(DataTableColumnDirective)
    public columns: QueryList<DataTableColumnDirective>;
}