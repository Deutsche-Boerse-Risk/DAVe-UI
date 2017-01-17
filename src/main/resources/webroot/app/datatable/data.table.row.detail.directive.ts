import {Directive, ContentChildren, QueryList} from '@angular/core';

import {DataTableColumnGroupDirective} from './data.table.column.group.directive';

@Directive({
    selector: 'row-detail'
})
export class DataTableRowDetailDirective {

    @ContentChildren(DataTableColumnGroupDirective, {descendants: false})
    public columnGroups: QueryList<DataTableColumnGroupDirective>;
}