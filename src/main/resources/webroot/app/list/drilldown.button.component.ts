import {Component, Input} from '@angular/core';

declare let $: any;

@Component({
    moduleId: module.id,
    selector: 'drilldown-button',
    templateUrl: 'drilldown.button.component.html',
    styleUrls: ['drilldown.button.component.css']
})
export class DrilldownButtonComponent {

    @Input()
    public routerLink: any[] | string;
}