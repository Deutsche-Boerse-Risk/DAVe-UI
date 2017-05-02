import {Component} from '@angular/core';
import {ROUTES} from '../routes/routing.paths';

@Component({
    moduleId   : module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls  : [
        '../component.css',
        'dashboard.component.css'
    ]
})
export class DashboardComponent {

    public get routerRoots() {
        return ROUTES;
    }
}