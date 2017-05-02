import {Component} from '@angular/core';
@Component({
    moduleId : module.id,
    template : `
        <pool-margin-summary></pool-margin-summary>
        <liqui-group-margin-aggregation></liqui-group-margin-aggregation>
    `,
    styleUrls: ['../component.css']
})
export class MarginRequirementOverviewComponent {
}