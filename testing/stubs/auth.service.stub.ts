import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthServiceStub {

    private user: string;

    public authRequestedPath: string;

    public isLoggedIn(): boolean {
        return !!this.user;
    }

    public getLoggedUser(): string {
        return this.user;
    }

    public login(username: string, password: string): Observable<boolean> {
        this.user = username;
        return Observable.of(true);
    }

    public logout() {
        delete this.user;
    }
}