import {Component} from '@angular/core';

import {COMPONENT_CSS} from '@dbg-riskit/DAVe-common';

@Component({
    moduleId : module.id,
    template : `
        <pool-margin-summary></pool-margin-summary>
        <liqui-group-margin-aggregation></liqui-group-margin-aggregation>
    `,
    styleUrls: ['../../' + COMPONENT_CSS]
})
export class MarginRequirementOverviewComponent {
}