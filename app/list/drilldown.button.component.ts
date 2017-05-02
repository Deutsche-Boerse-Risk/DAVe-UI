import {Component, Input} from '@angular/core';

@Component({
    moduleId   : module.id,
    selector   : 'drilldown-button',
    templateUrl: 'drilldown.button.component.html',
    styleUrls  : ['../component.css']
})
export class DrilldownButtonComponent {

    @Input()
    public routerLink: any[] | string;
}