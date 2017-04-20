import {Injectable, EventEmitter} from '@angular/core';

import {JwtHelper} from 'angular2-jwt';

import {HttpService} from '../http.service';
import {Observable} from 'rxjs/Observable';
import {AuthStorageService} from './auth.storage.service';

export const AuthURL = {
    login  : '/token',
    status : '/userinfo',
    refresh: '/token'
};

export const authClientID: string = (<any>window).authClientID;

export const AUTH_CHECK_INTERVAL = 60000;

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
}

export interface AuthStatusResponse {
    username: string;
}

export interface TokenData {
    username: string;
    typ?: string;

    //The issuer of the token.
    iss?: string;
    //The subject of the token.
    sub?: string;
    //The audience of the token.
    aud?: string;
    // This will probably be the registered claim most often used. This will define the expiration in NumericDate value.
    // The expiration MUST be after the current date/time.
    exp: number;
    //Defines the time before which the JWT MUST NOT be accepted for processing.
    nbf?: number;
    //The time the JWT was issued. Can be used to determine the age of the JWT.
    iat?: number;
    //Unique identifier for the JWT. Can be used to prevent the JWT from being replayed.
    // This is helpful for a one time use token.
    jti?: string;
}

@Injectable()
export class AuthService {

    private jwtHelper: JwtHelper = new JwtHelper();

    public loggedInChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public authRequestedPath: string;

    private tokenData: TokenData;

    private refreshTimeout: number;
    private authCheckInterval: number;

    constructor(private http: HttpService<any>, private storage: AuthStorageService) {
        let token = this.storage.id_token;
        if (token) {
            if (this.jwtHelper.isTokenExpired(token)) {
                this.logout();
            } else {
                this.tokenData = this.jwtHelper.decodeToken(token);
                this.doLogin();
            }
        }
        http.unauthorized.subscribe(() => {
            this.logout();
        });
    }

    public isLoggedIn(): boolean {
        return !!this.tokenData;
    }

    public getLoggedUser(): string {
        return this.tokenData.username;
    }

    public login(username: string, password: string): Observable<boolean> {
        return this.http.post({
            resourceURL: AuthURL.login,
            data       : HttpService.toURLSearchParams({
                username  : username,
                password  : password,
                grant_type: 'password',
                client_id : authClientID
            }),
            secure     : false,
            auth       : true
        }).flatMap((response: AuthResponse) => {
            return this.processToken(response, username);
        });
    }

    private processToken(response: AuthResponse, username: string): Observable<boolean> {
        if (response.access_token) {
            try {
                this.tokenData = this.jwtHelper.decodeToken(response.access_token);
                if (this.tokenData.username !== username) {
                    this.logout();
                    return Observable.throw({
                        status : 500,
                        message: 'Invalid token generated!'
                    });
                }

                if (this.jwtHelper.isTokenExpired(response.access_token)) {
                    this.logout();
                    return Observable.throw({
                        status : 500,
                        message: 'Invalid token expiration!'
                    });
                }
            } catch (err) {
                this.logout();
                return Observable.throw({
                    status : 500,
                    message: err ? err.toString() : 'Error parsing token from auth response!'
                });
            }
            // store username and token in local storage to keep user logged in between page refreshes
            this.storage.id_token = response.access_token;
            this.storage.refresh_token = response.refresh_token;
            this.storage.exp = this.jwtHelper.getTokenExpirationDate(this.storage.id_token);
            this.doLogin();

            return Observable.of(true);
        } else {
            this.logout();
            return Observable.throw({
                status : 401,
                message: 'Authentication failed. Server didn\'t generate a token.'
            });
        }
    }

    private doLogin() {
        this.setupAuthCheck();
        this.setupTokenRefresh();
        this.loggedInChange.emit(true);
    }

    public logout(): void {
        // remove user from local storage and clear http auth header
        delete this.tokenData;
        this.storage.clear();
        this.disableAuthCheck();
        this.disableTokenRefresh();
        this.loggedInChange.emit(false);
    }

    private setupAuthCheck() {
        this.disableAuthCheck();
        this.authCheckInterval = setInterval(this.checkAuth.bind(this), AUTH_CHECK_INTERVAL);
    }

    private disableAuthCheck() {
        if (this.authCheckInterval) {
            clearInterval(this.authCheckInterval);
        }
    }

    private checkAuth(): void {
        if (this.tokenData && this.storage.id_token) {
            this.http.get({
                resourceURL: AuthURL.status,
                auth       : true
            }).subscribe((data: AuthStatusResponse) => {
                if (!data || !this.tokenData || this.tokenData.username !== data.username) {
                    this.logout();
                }
            }, () => {
                this.logout();
            });
        } else {
            this.logout();
        }
    }

    private setupTokenRefresh() {
        if (!this.storage.exp && this.storage.id_token) {
            this.storage.exp = this.jwtHelper.getTokenExpirationDate(this.storage.id_token);
        }
        if (this.storage.refresh_in > 0) {
            this.disableTokenRefresh();
            this.refreshTimeout = setTimeout(this.refreshToken.bind(this),
                this.storage.refresh_in);
        }
    }

    private disableTokenRefresh() {
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }
    }

    private refreshToken(): void {
        if (this.tokenData && this.getLoggedUser() && this.storage.refresh_token) {
            this.http.post({
                resourceURL: AuthURL.refresh,
                data       : HttpService.toURLSearchParams({
                    grant_type   : 'refresh_token',
                    client_id    : authClientID,
                    refresh_token: this.storage.refresh_token
                }),
                secure     : false,
                auth       : true
            }).subscribe((response: AuthResponse) => {
                this.processToken(response, this.getLoggedUser());
            }, () => {
                this.logout();
            });
        } else {
            this.logout();
        }
    }
}