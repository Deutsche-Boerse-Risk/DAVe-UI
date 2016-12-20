import {Router, ActivatedRoute} from "@angular/router";
import {ElementRef, Component, HostBinding} from "@angular/core";

import {AbstractComponent} from "../abstract.component";
import {AuthService} from "./auth.service";

@Component({
    moduleId: module.id,
    selector: 'login-menu',
    templateUrl: 'login.menu.component.html',
    styleUrls: ['login.menu.component.css']
})
export class LoginMenuComponent extends AbstractComponent {

    /**
     * Just to add bootstrap classes to be able to fix the layout...
     */
    @HostBinding('class.nav')
    @HostBinding('class.navbar-nav')
    @HostBinding('class.navbar-top-links')
    @HostBinding('class.navbar-right')
    private classes: boolean = true;

    constructor(private authService: AuthService,
                router: Router,
                route: ActivatedRoute,
                el: ElementRef) {
        super(router, route, el);
    }

    public get authStatus(): boolean {
        return this.authService.isLoggedIn();
    }

    public logout(): void {
        this.authService.logout();
    }
}