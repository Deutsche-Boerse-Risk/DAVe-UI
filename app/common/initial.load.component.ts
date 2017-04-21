import {Component} from '@angular/core';

@Component({
    moduleId : module.id,
    selector : 'initial-load',
    template : `
        <md-card class="warn">
            Loading...
        </md-card>`,
    styleUrls: ['../common.component.css']
})
export class InitialLoadComponent {
}