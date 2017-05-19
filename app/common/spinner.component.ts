import {Component, Input} from '@angular/core';
@Component({
    moduleId : module.id,
    selector : 'spinner',
    template : `
        <md-spinner [style.height]="viewportSize"
                    [style.width]="viewportSize"></md-spinner>`,
    styleUrls: ['../component.css']
})
export class SpinnerComponent {

    @Input()
    public viewportSize: string;

}