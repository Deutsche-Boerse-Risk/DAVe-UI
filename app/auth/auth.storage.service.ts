import {Injectable} from '@angular/core';

import {AuthConfigConsts} from 'angular2-jwt';

export const REFRESH_TOKEN_NAME = 'refresh_token';

@Injectable()
export class AuthStorageService {

    public get id_token(): string {
        return localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
    }

    public set id_token(token: string) {
        localStorage.setItem(AuthConfigConsts.DEFAULT_TOKEN_NAME, token);
    }

    public get refresh_token(): string {
        return localStorage.getItem(REFRESH_TOKEN_NAME);
    }

    public set refresh_token(token: string) {
        localStorage.setItem(REFRESH_TOKEN_NAME, token);
    }

    public get exp(): Date {
        let exp = localStorage.getItem('exp');
        if (!exp) {
            return null;
        }

        return new Date(parseInt(exp, 10));
    }

    public set exp(exp: Date) {
        if (exp === null) {
            localStorage.removeItem('exp');
        } else {
            localStorage.setItem('exp', exp.valueOf().toString(10));
        }
    }

    public get refresh_in(): number {
        if (!this.exp) {
            return -1;
        }
        return this.exp.valueOf() - (new Date().valueOf()) - (30 * 1000);
    }

    public clear() {
        localStorage.removeItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('exp');
    }
}