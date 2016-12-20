import {Component} from "@angular/core";

@Component({
    moduleId: module.id,
    selector: 'no-data',
    template: `<div class="panel-body">
                    <div class="alert alert-info" role="alert">No data available.</div>
                </div>`,
    styleUrls: ['common.component.css']
})
export class NoDataComponent {
}