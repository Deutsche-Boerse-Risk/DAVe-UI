import {Component, Input} from '@angular/core';

@Component({
    moduleId : module.id,
    selector : 'detail-row-button',
    template : `
        <a md-icon-button [routerLink]="routerLink">
            <md-icon>timeline</md-icon>
        </a>
    `,
    styleUrls: ['data.table.button.component.css']
})
export class DetailRowButtonComponent {

    @Input()
    public routerLink: any[];
}

