import {Component} from '@angular/core';

@Component({
    moduleId : module.id,
    selector : 'no-data',
    template : `
        <md-card class="info">
            No data available.
        </md-card>`,
    styleUrls: ['../common.component.css']
})
export class NoDataComponent {
}