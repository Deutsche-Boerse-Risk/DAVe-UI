import {Component, Input} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'update-failed',
    template: `<div class="panel-body">
                    <div class="alert alert-danger" role="alert">Failed to update the data: {{error}}.</div>
                </div>`,
    styleUrls: ['../common.component.css']
})
export class UpdateFailedComponent {

    @Input('message')
    public error: string;

}