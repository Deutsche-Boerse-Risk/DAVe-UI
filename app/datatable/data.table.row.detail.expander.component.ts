import {Component, Input} from '@angular/core';

export const selector = 'row-detail-expander';

@Component({
    moduleId : module.id,
    selector : selector,
    template : `
        <a md-icon-button mdTooltip="Show additional fields">
            <md-icon *ngIf="!expanded">expand_more</md-icon>
            <md-icon *ngIf="expanded">expand_less</md-icon>
        </a>
    `,
    styleUrls: [
        '../component.css',
        'inline.button.css'
    ]
})
export class DataTableRowDetailExpander {

    @Input()
    public expanded: boolean;
}

