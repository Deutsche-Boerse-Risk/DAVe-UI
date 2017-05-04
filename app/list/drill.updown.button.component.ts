import {Component, ElementRef, Input} from '@angular/core';

@Component({
    moduleId   : module.id,
    selector   : 'drilldown-button, drillup-button',
    templateUrl: 'drill.updown.button.component.html',
    styleUrls  : ['../component.css']
})
export class DrillUpDownButtonComponent {

    @Input()
    public routerLink: any[] | string;

    private _isDrillUp: boolean;

    constructor(elementRef: ElementRef) {
        const tagName = elementRef.nativeElement.tagName.toLowerCase();
        this._isDrillUp = tagName === 'drillup-button';
    }

    public get drillUp(): boolean {
        return this._isDrillUp;
    }
}