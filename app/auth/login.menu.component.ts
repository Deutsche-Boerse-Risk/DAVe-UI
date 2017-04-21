import {Component, HostBinding, Input} from '@angular/core';

import {AuthService} from './auth.service';
import {ROUTES} from '../routes/routing.paths';

@Component({
    moduleId   : module.id,
    selector   : 'login-menu',
    templateUrl: 'login.menu.component.html',
    styleUrls  : ['../common.component.css'],
    styles     : [':host { display: flex !important; }']
})
export class LoginMenuComponent {

    @Input()
    @HostBinding('style.flex-direction')
    public orientation: 'row' | 'column' = 'row';

    constructor(private authService: AuthService) {
    }

    public get authStatus(): boolean {
        return this.authService.isLoggedIn();
    }

    public logout(): void {
        this.authService.logout();
    }

    public get routerRoots() {
        return ROUTES;
    }
}