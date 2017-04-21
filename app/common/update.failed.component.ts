import {Component, Input} from '@angular/core';

@Component({
    moduleId : module.id,
    selector : 'update-failed',
    template : `
        <md-card class="error">
            Failed to update the data: {{error}}.
        </md-card>`,
    styleUrls: ['../common.component.css']
})
export class UpdateFailedComponent {

    @Input('message')
    public error: string;

}