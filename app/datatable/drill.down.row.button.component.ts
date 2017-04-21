import {Component, Input} from '@angular/core';

@Component({
    moduleId : module.id,
    selector : 'drilldown-row-button',
    template : `
        <a md-icon-button [routerLink]="routerLink">
            <md-icon>my_location</md-icon>
        </a>
    `,
    styleUrls: ['data.table.button.component.css']
})
export class DrillDownRowButtonComponent {

    @Input()
    public routerLink: any[];
}

