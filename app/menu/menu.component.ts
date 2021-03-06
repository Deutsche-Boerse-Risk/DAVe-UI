import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input} from '@angular/core';

import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-devkit';

import {ROUTES} from '../routes/routing.paths';

@Component({
    moduleId       : module.id,
    selector       : 'app-menu',
    templateUrl    : 'menu.component.html',
    styleUrls      : [
        '../../' + COMPONENT_CSS,
        'menu.component.css'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

    @Input()
    @HostBinding('style.flex-direction')
    public orientation: 'row' | 'column' = 'row';

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }

    public menuClosed(): void {
        this.changeDetectorRef.markForCheck();
    }

    public get routerRoots() {
        return ROUTES;
    }
}