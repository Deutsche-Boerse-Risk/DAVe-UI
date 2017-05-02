import {Component, Input} from '@angular/core';

@Component({
    moduleId : module.id,
    selector : 'detail-row-button',
    template : `
        <a md-icon-button [routerLink]="routerLink" mdTooltip="Detail">
            <md-icon>timeline</md-icon>
        </a>
    `,
    styleUrls: ['../component.css']
})
export class DetailRowButtonComponent {

    @Input()
    public routerLink: any[];
}

