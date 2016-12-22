import {Component, HostBinding} from '@angular/core';

import {AuthService} from './auth.service';

@Component({
    moduleId: module.id,
    selector: 'login-menu',
    templateUrl: 'login.menu.component.html',
    styleUrls: ['login.menu.component.css']
})
export class LoginMenuComponent {

    /**
     * Just to add bootstrap classes to be able to fix the layout...
     */
    @HostBinding('class.nav')
    @HostBinding('class.navbar-nav')
    @HostBinding('class.navbar-top-links')
    @HostBinding('class.navbar-right')
    private classes: boolean = true;

    constructor(private authService: AuthService) {
    }

    public get authStatus(): boolean {
        return this.authService.isLoggedIn();
    }

    public logout(): void {
        this.authService.logout();
    }
}