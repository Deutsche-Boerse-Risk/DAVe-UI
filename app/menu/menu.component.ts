import {Component, HostBinding, Input} from '@angular/core';
import {ROUTES} from '../routes/routing.paths';

@Component({
    moduleId   : module.id,
    selector   : 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls  : [
        '../component.css',
        'menu.component.css'
    ]
})
export class MenuComponent {

    @Input()
    @HostBinding('style.flex-direction')
    public orientation: 'row' | 'column' = 'row';

    public get routerRoots() {
        return ROUTES;
    }
}