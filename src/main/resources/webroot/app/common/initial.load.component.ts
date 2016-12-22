import {Component} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'initial-load',
    template: `<div class="panel-body" >
                    <div class="alert alert-warning" role="alert">Loading ...</div>
                </div>`,
    styleUrls: ['common.component.css']
})
export class InitialLoadComponent {
}