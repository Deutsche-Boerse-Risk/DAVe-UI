import {Component, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractComponent} from "./abstract.component";
import {AuthService} from "./login/auth.service";

@Component({
    moduleId: module.id,
    selector: 'dave',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent extends AbstractComponent {


    constructor(private authService: AuthService,
                router: Router,
                route: ActivatedRoute,
                el: ElementRef) {
        super(router, route, el);
    }


    public get authStatus(): boolean {
        return this.authService.isLoggedIn();
    };
}
