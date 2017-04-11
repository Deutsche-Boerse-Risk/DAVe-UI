import {Injectable, EventEmitter} from '@angular/core';

import {AuthConfigConsts, JwtHelper} from 'angular2-jwt';

import {HttpService} from '../http.service';
import {Observable} from 'rxjs/Observable';

const url = {
    login  : '/protocol/openid-connect/token',
    status : '/protocol/openid-connect/token/introspect',
    refresh: '/protocol/openid-connect/token'
};

export interface AuthResponse {
    id_token?: string;
    access_token?: string;
    refresh_token?: string;
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

    constructor(private http: HttpService<any>) {
        let token = localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
        if (token) {
            if (this.jwtHelper.isTokenExpired(token)) {
                localStorage.removeItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
            } else {
                this.tokenData = this.jwtHelper.decodeToken(token);
            }
        }
        setInterval(this.checkAuth.bind(this), 60000);
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
            resourceURL : url.login,
            data        : AuthService.toURLParams({
                username  : username,
                password  : password,
                grant_type: 'password',
                client_id : 'dave-ui'
            }),
            content_type: 'application/x-www-form-urlencoded',
            secure      : false,
            auth        : true
        }).flatMap((response: AuthResponse) => {
            return this.processToken(response, username);
        });
    }

    private processToken(response: AuthResponse, username: string): Observable<boolean> {
        if (response.id_token) {
            try {
                this.tokenData = this.jwtHelper.decodeToken(response.id_token);
                if (this.tokenData.username !== username) {
                    delete this.tokenData;
                    return Observable.throw({
                        status : 500,
                        message: 'Invalid token generated!'
                    });
                }

                if (this.jwtHelper.isTokenExpired(response.id_token)) {
                    delete this.tokenData;
                    return Observable.throw({
                        status : 500,
                        message: 'Invalid token expiration!'
                    });
                }
            } catch (err) {
                delete this.tokenData;
                return Observable.throw({
                    status : 500,
                    message: err ? err.toString() : 'Error parsing token from auth response!'
                });
            }
            // store username and token in local storage to keep user logged in between page refreshes
            localStorage.setItem(AuthConfigConsts.DEFAULT_TOKEN_NAME, response.id_token);
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);

            this.loggedInChange.emit(true);

            return Observable.of(true);
        } else {
            return Observable.throw({
                status : 401,
                message: 'Authentication failed. Server didn\'t generate a token.'
            });
        }
    }

    public logout(): void {
        // remove user from local storage and clear http auth header
        delete this.tokenData;
        localStorage.removeItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
        this.loggedInChange.emit(false);
    }

    private checkAuth(): void {
        if (this.tokenData) {
            this.refreshTokenIfExpires();
            // if (this.tokenData) {
            //     this.http.post({
            //         resourceURL: url.status,
            //         data       : AuthService.toURLParams({
            //             client_id : 'dave-ui'
            //         }),
            //         content_type: 'application/x-www-form-urlencoded',
            //         auth       : true
            //     }).subscribe((data: AuthStatusResponse) => {
            //         if (!this.tokenData || this.tokenData.username !== data.username) {
            //             this.logout();
            //         }
            //     }, () => {
            //         this.logout();
            //     });
            // }
        }
    }

    private refreshTokenIfExpires(): void {
        if (this.getLoggedUser()) {
            let token = localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
            if (!token) {
                this.logout();
                return;
            }
            let expirationThreshold = new Date();
            expirationThreshold.setMinutes(expirationThreshold.getMinutes() + 10);
            let tokenExpires = this.jwtHelper.getTokenExpirationDate(token) < expirationThreshold;
            if (tokenExpires) {
                this.http.post({
                    resourceURL : url.refresh,
                    data        : AuthService.toURLParams({
                        grant_type   : 'refresh_token',
                        client_id    : 'dave-ui',
                        refresh_token: localStorage.getItem('refresh_token')
                    }),
                    content_type: 'application/x-www-form-urlencoded',
                    auth        : true
                }).subscribe((response: AuthResponse) => {
                    this.processToken(response, this.getLoggedUser());
                }, () => {
                    this.logout();
                });
            }
        } else {
            this.logout();
        }
    }

    private static toURLParams(data: { [key: string]: string }): string {
        let params = new URLSearchParams();
        Object.keys(data).forEach((key: string) => {
            params.set(key, data[key]);
        });
        return params.toString();
    };
}