import {Component, Input} from '@angular/core';

@Component({
    moduleId : module.id,
    selector : 'drilldown-row-button',
    template : `
        <a md-icon-button [routerLink]="routerLink" mdTooltip="Drilldown">
            <md-icon>my_location</md-icon>
        </a>
    `,
    styleUrls: [
        '../component.css',
        'inline.button.scss'
    ]
})
export class DrillDownRowButtonComponent {

    @Input()
    public routerLink: any[];
}

