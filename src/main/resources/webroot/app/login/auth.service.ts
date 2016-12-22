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
}

@Injectable()
export class AuthService extends AbstractHttpService<any> {

    private jwtHelper: JwtHelper = new JwtHelper();

    private loggedIn: boolean;
    private authUsername: string;

    public loggedInChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public authRequestedPath: string;

    private tokenData: TokenData;

    constructor(http: Http, authHttp: AuthHttp) {
        super(http, authHttp);
        let token = localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
        if (token) {
            this.tokenData = this.jwtHelper.decodeToken(token);
            this.loggedIn = true;
            this.authUsername = this.tokenData.username;
        }
        setInterval(this.checkAuth.bind(this), 60000);
    }

    public isLoggedIn(): boolean {
        return this.loggedIn;
    }

    public getLoggedUser(): string {
        return this.authUsername;
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
                        reject(<ErrorResponse>{
                            status: 500,
                            message: 'Invalid token generated!'
                        });
                    }

                    if (this.jwtHelper.isTokenExpired(response.token)) {
                        reject(<ErrorResponse>{
                            status: 500,
                            message: 'Invalid token expiration!'
                        });
                    }
                } catch (err) {
                    reject(<ErrorResponse>{
                        status: 500,
                        message: err ? err.toString() : 'Error parsing token from auth response!'
                    });
                }
                this.loggedIn = true;
                this.authUsername = username;
                // store username and token in local storage to keep user logged in between page refreshes
                localStorage.setItem(AuthConfigConsts.DEFAULT_TOKEN_NAME, response.token);

                this.loggedInChange.emit(this.loggedIn);

                resolve(this.loggedIn);
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
        this.loggedIn = false;
        delete this.authUsername;
        localStorage.removeItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
        this.loggedInChange.emit(this.loggedIn)
    }

    private checkAuth(): void {
        if (this.loggedIn) {
            this.refreshTokenIfExpires();
            let loggedIn = this.loggedIn;
            this.get({
                resourceURL: url.status
            }).subscribe((data: AuthStatusResponse) => {
                if (data.username) {
                    this.loggedIn = true;
                    this.authUsername = data.username;

                    if (!loggedIn) {
                        this.loggedInChange.emit(this.loggedIn);
                    }
                } else {
                    this.logout();
                }
            }, () => {
                this.logout();
            });
        }
    }

    private refreshTokenIfExpires(): void {
        if (this.getLoggedUser()) {
            let token = localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
            let expirationThreshold = new Date();
            expirationThreshold.setMinutes(expirationThreshold.getMinutes() + 10);
            let tokenExpires = this.jwtHelper.getTokenExpirationDate(token) < expirationThreshold;
            if (tokenExpires) {
                this.get({
                    resourceURL: url.refresh
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
}