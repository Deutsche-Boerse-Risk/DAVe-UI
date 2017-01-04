import {Injectable, EventEmitter} from '@angular/core';
import {Http} from '@angular/http';

import {AuthHttp, AuthConfigConsts, JwtHelper} from 'angular2-jwt'

import {AbstractHttpService, ErrorResponse} from '../abstract.http.service';

const url = {
    login: '/user/login',
    status: '/user/loginStatus',
    refresh: '/user/refreshToken'
};

interface AuthResponse {
    token: string;
}

interface AuthStatusResponse {
    username: string;
}

interface TokenData {
    username: string;
    exp: number;
    iat: number;
}

@Injectable()
export class AuthService extends AbstractHttpService<any> {

    private jwtHelper: JwtHelper = new JwtHelper();

    public loggedInChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public authRequestedPath: string;

    private tokenData: TokenData;

    constructor(http: Http, authHttp: AuthHttp) {
        super(http, authHttp);
        let token = localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
        if (token) {
            if (!this.jwtHelper.isTokenExpired(token)) {
                this.tokenData = this.jwtHelper.decodeToken(token);
            } else {
                localStorage.removeItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
            }
        }
        setInterval(this.checkAuth.bind(this), 60000);
    }

    public isLoggedIn(): boolean {
        return !!this.tokenData;
    }

    public getLoggedUser(): string {
        return this.tokenData.username;
    }

    public login(username: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.post({
                resourceURL: url.login,
                data: {
                    username: username,
                    password: password
                }
            }, false).subscribe((response: AuthResponse) => {
                this.processToken(response, username).then(resolve).catch(reject);
            }, reject);
        });
    }

    private processToken(response: AuthResponse, username: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (response.token) {
                try {
                    this.tokenData = this.jwtHelper.decodeToken(response.token);
                    if (this.tokenData.username !== username) {
                        delete this.tokenData;
                        reject(<ErrorResponse>{
                            status: 500,
                            message: 'Invalid token generated!'
                        });
                    }

                    if (this.jwtHelper.isTokenExpired(response.token)) {
                        delete this.tokenData;
                        reject(<ErrorResponse>{
                            status: 500,
                            message: 'Invalid token expiration!'
                        });
                    }
                } catch (err) {
                    delete this.tokenData;
                    reject(<ErrorResponse>{
                        status: 500,
                        message: err ? err.toString() : 'Error parsing token from auth response!'
                    });
                }
                // store username and token in local storage to keep user logged in between page refreshes
                localStorage.setItem(AuthConfigConsts.DEFAULT_TOKEN_NAME, response.token);

                this.loggedInChange.emit(true);

                resolve(true);
            } else {
                reject(<ErrorResponse>{
                    status: 401,
                    message: 'Authentication failed. Server didn\'t generate a token.'
                });
            }
        });
    }

    public logout(): void {
        // remove user from local storage and clear http auth header
        delete this.tokenData;
        localStorage.removeItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
        this.loggedInChange.emit(false)
    }

    private checkAuth(): void {
        if (this.tokenData) {
            this.refreshTokenIfExpires();
            if (this.tokenData) {
                this.get({
                    resourceURL: url.status
                }).subscribe((data: AuthStatusResponse) => {
                    if (!this.tokenData || this.tokenData.username !== data.username) {
                        this.logout();
                    }
                }, () => {
                    this.logout();
                });
            }
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
                this.get({
                    resourceURL: url.refresh
                }).subscribe((response: AuthResponse) => {
                    //noinspection JSIgnoredPromiseFromCall
                    this.processToken(response, this.getLoggedUser());
                }, () => {
                    this.logout();
                });
            }
        } else {
            this.logout();
        }
    }
}