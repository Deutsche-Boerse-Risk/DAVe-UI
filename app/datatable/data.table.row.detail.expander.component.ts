import {Component} from '@angular/core';

export const selector = 'row-detail-expander';

@Component({
    moduleId: module.id,
    selector: selector,
    template: `
<a>
    <span class="fa fa-chevron-circle-down" 
        aria-hidden="true" 
        title="Show additional fields"></span>
</a>
`,
    styleUrls: ['data.table.button.component.css']
})
export class DataTableRowDetailExpander {
}

