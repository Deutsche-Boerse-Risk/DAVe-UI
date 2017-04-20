import {Component} from '@angular/core';
import {ROUTES} from '../routes/routing.paths';

@Component({
    moduleId   : module.id,
    selector   : 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls  : ['menu.component.css']
})
export class MenuComponent {
    public get routerRoots() {
        return ROUTES;
    }
}