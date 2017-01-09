import {Component, Input} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'detail-row-button',
    template: `
<a [routerLink]="routerLink">
    <span class="fa fa-bar-chart-o" aria-hidden="true" title="Detail"></span>
</a>
`,
    styleUrls: ['data.table.button.component.css']
})
export class DetailRowButtonComponent {

    @Input()
    public routerLink: any[];
}

