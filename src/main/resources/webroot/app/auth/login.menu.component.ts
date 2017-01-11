import {Component, HostBinding} from '@angular/core';

import {AuthService} from './auth.service';

@Component({
    moduleId: module.id,
    selector: 'login-menu',
    templateUrl: 'login.menu.component.html',
    styleUrls: ['../common.component.css']
})
export class LoginMenuComponent {

    //noinspection JSUnusedLocalSymbols
    /**
     * Just to add bootstrap classes to be able to fix the layout...
     */
    @HostBinding('class.nav')
    @HostBinding('class.navbar-nav')
    @HostBinding('class.navbar-top-links')
    @HostBinding('class.navbar-right')
    public _classes: boolean = true;

    constructor(private authService: AuthService) {
    }

    public get authStatus(): boolean {
        return this.authService.isLoggedIn();
    }

    //noinspection JSUnusedGlobalSymbols
    public logout(): void {
        this.authService.logout();
    }
}