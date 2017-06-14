import {Component} from '@angular/core';

import {COMPONENT_CSS} from '@dbg-riskit/DAVe-UI-common';

import {ROUTES} from '../routes/routing.paths';

@Component({
    moduleId   : module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls  : [
        '../../' + COMPONENT_CSS,
        'dashboard.component.css'
    ]
})
export class DashboardComponent {

    public get routerRoots() {
        return ROUTES;
    }
}