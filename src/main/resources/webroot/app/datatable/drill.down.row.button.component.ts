import {Component, Input} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'drilldown-row-button',
    template: `
<a [routerLink]="routerLink">
    <span class="fa fa-bullseye" aria-hidden="true" title="Drilldown"></span>
</a>
`,
    styleUrls: ['data.table.button.component.css']
})
export class DrillDownRowButtonComponent {

    @Input()
    public routerLink: any[];
}

