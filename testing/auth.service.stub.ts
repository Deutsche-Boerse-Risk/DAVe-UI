import {Observable} from "rxjs/Observable";

export class AuthServiceStub {

    private user: string;

    public isLoggedIn(): boolean {
        return false;
    }

    public getLoggedUser(): string {
        return this.user;
    }

    public login(username: string, password: string): Observable<boolean> {
        this.user = username;
        return Observable.of(true);
    }
}