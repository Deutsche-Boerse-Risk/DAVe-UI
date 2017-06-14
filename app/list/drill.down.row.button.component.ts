import {Component, Input} from '@angular/core';

import {COMPONENT_CSS} from '@dbg-riskit/DAVe-UI-common';

@Component({
    moduleId : module.id,
    selector : 'drilldown-row-button',
    template : `
        <a md-icon-button [routerLink]="routerLink" mdTooltip="Drill down">
            <md-icon>my_location</md-icon>
        </a>
    `,
    styleUrls: [
        '../../' + COMPONENT_CSS,
        'inline.button.css'
    ]
})
export class DrillDownRowButtonComponent {

    @Input()
    public routerLink: any[];
}

