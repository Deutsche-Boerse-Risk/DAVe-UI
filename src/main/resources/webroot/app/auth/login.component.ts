import {Router} from '@angular/router';
import {Component} from '@angular/core';

import {AuthService} from './auth.service';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: ['../common.component.css']
})
export class LoginComponent {

    public errorMessage: string;

    public username: string;
    public password: string;

    constructor(private authService: AuthService,
                private router: Router) {
    }

    public get authStatus(): boolean {
        return this.authService.isLoggedIn();
    }

    public get authUsername(): string {
        return this.authService.getLoggedUser();
    }

    public login(): void {
        this.authService.login(this.username, this.password).subscribe(
            (res: boolean) => {
                if (res) {
                    if (this.authService.authRequestedPath) {
                        this.router.navigateByUrl(this.authService.authRequestedPath);
                    }
                    this.router.navigate(['/dashboard']);
                } else {
                    this.errorMessage = 'Authentication failed. Server didn\'t generate a token.';
                }
            },
            () => {
                this.errorMessage = 'Authentication failed. Is the username and password correct?';
            });
    }
}