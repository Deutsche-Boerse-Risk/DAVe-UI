import {Component} from '@angular/core';

import {AuthService} from "./login/auth.service";

@Component({
    moduleId: module.id,
    selector: 'dave',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent {


    constructor(private authService: AuthService) {
    }


    public get authStatus(): boolean {
        return this.authService.isLoggedIn();
    };
}
