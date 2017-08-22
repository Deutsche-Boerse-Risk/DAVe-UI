import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-devkit';

@Component({
    moduleId       : module.id,
    selector       : 'drilldown-row-button',
    template       : `
        <a md-icon-button [routerLink]="routerLink" mdTooltip="Drill down">
            <md-icon>my_location</md-icon>
        </a>
    `,
    styleUrls      : [
        '../../' + COMPONENT_CSS,
        'inline.button.css'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrillDownRowButtonComponent {

    @Input()
    public routerLink: any[];
}

