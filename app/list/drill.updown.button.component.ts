import {ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';

import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-devkit';

@Component({
    moduleId       : module.id,
    selector       : 'drilldown-button, drillup-button',
    templateUrl    : 'drill.updown.button.component.html',
    styleUrls      : ['../../' + COMPONENT_CSS],
    changeDetection: ChangeDetectionStrategy.OnPush
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