import {Component} from '@angular/core';

export const selector = 'row-detail-expander';

@Component({
    moduleId : module.id,
    selector : selector,
    template : `
        <a md-icon-button mdTooltip="Show additional fields">
            <md-icon>expand_more</md-icon>
        </a>
    `,
    styleUrls: ['../common.component.css']
})
export class DataTableRowDetailExpander {
}

