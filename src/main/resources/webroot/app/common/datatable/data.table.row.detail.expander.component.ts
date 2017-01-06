import {Component} from '@angular/core';

export const selector = 'row-detail-expander';

@Component({
    selector: selector,
    template: `
<a>
    <span class="fa fa-chevron-circle-down" 
        aria-hidden="true" 
        title="Show additional fields"></span>
    </a>
`
})
export class DataTableRowDetailExpander {
}

