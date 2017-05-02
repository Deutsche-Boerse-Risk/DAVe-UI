import {Component} from '@angular/core';

import {AuthService} from './auth/auth.service';
import {ROUTES} from './routes/routing.paths';

@Component({
    moduleId   : module.id,
    selector   : 'dave',
    templateUrl: 'app.component.html',
    styleUrls  : [
        'component.css',
        'app.component.css'
    ]
})
export class AppComponent {

    constructor(private authService: AuthService) {
    }

    public get authStatus(): boolean {
        return this.authService.isLoggedIn();
    };

    public get mediaSmall(): boolean {
        if (!window.matchMedia) {
            return false;
        }
        return window.matchMedia('screen and (max-width:800px)').matches;
    }

    public get routerRoots() {
        return ROUTES;
    }
}
