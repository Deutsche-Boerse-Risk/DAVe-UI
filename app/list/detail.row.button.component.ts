import {Component, Input} from '@angular/core';

import {COMPONENT_CSS} from '@dbg-riskit/DAVe-UI-common';

@Component({
    moduleId : module.id,
    selector : 'detail-row-button',
    template : `
        <a md-icon-button [routerLink]="routerLink" mdTooltip="Detail">
            <md-icon>timeline</md-icon>
        </a>
    `,
    styleUrls: [
        '../../' + COMPONENT_CSS,
        'inline.button.css'
    ]
})
export class DetailRowButtonComponent {

    @Input()
    public routerLink: any[];
}

