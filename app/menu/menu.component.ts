import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';

import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-common';

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

    public get routerRoots() {
        return ROUTES;
    }
}