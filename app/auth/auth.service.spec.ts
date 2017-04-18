import {TestBed, inject, fakeAsync, tick} from '@angular/core/testing';

import {HttpServiceStub} from '../../testing';

import {encodeTestToken} from 'angular2-jwt/angular2-jwt-test-helpers';

import {AuthConfigConsts} from 'angular2-jwt';

import {AuthService, TokenData, AuthResponse, AuthStatusResponse} from './auth.service';
import {HttpService, ErrorResponse} from '../http.service';
import {AuthStorageService} from './auth.storage.service';

function addMinutes(minutes: number): number {
    return new Date(Date.now() + minutes * 60000).getTime() / 1000;
}

describe('Auth service', () => {

    afterEach(() => {
        // Cleanup storage
        localStorage.removeItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
    });

    describe('(nothing in the local storage)', () => {
        let username = 'UserA';

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    AuthStorageService,
                    AuthService,
                    {
                        provide : HttpService,
                        useClass: HttpServiceStub
                    }
                ]
            });
        });

        it('isLoggedIn has to return false and getLoggedUser has to fail', fakeAsync(
            inject([AuthService, AuthStorageService], (authService: AuthService, storage: AuthStorageService) => {
                expect(authService.isLoggedIn()).toBeFalsy();
                expect(() => authService.getLoggedUser()).toThrow();
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
                expect(storage.id_token).toBeNull();
            }))
        );

        it('login will throw error if no token was provided by server', (done: DoneFn) => {
            fakeAsync(
                inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                    let authResponse: AuthResponse = {};
                    http.returnValue(authResponse);

                    let postSpy = spyOn(http, 'post').and.callThrough();

                    authService.login(username, 'password').subscribe(() => {
                        done.fail();
                    }, (fail: ErrorResponse) => {
                        expect(fail.status).toBe(401);
                        expect(postSpy.calls.mostRecent().args[0].data.get('username')).toBe(username);
                        done();
                    });
                }))();
        });

        it('login will throw error if invalid token was provided by server', (done: DoneFn) => {
            fakeAsync(
                inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                    let authResponse: AuthResponse = {
                        access_token: 'invalidString'
                    };
                    http.returnValue(authResponse);

                    let postSpy = spyOn(http, 'post').and.callThrough();

                    authService.login(username, 'password').subscribe(() => {
                        done.fail();
                    }, (fail: ErrorResponse) => {
                        expect(fail.status).toBe(500);
                        expect(postSpy.calls.mostRecent().args[0].data.get('username')).toBe(username);
                        done();
                    });
                }))();
        });

        it('login will throw error if token with different username was provided by server', (done: DoneFn) => {
            fakeAsync(
                inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                    let authResponse: AuthResponse = {
                        access_token: encodeTestToken({
                            username: 'UserB'
                        })
                    };
                    http.returnValue(authResponse);

                    let postSpy = spyOn(http, 'post').and.callThrough();

                    authService.login(username, 'password').subscribe(() => {
                        done.fail();
                    }, (fail: ErrorResponse) => {
                        expect(fail.status).toBe(500);
                        expect(postSpy.calls.mostRecent().args[0].data.get('username')).toBe(username);
                        done();
                    });
                }))();
        });

        it('login will throw error if already expired token was provided by server', (done: DoneFn) => {
            fakeAsync(
                inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                    let postSpy = spyOn(http, 'post').and.callThrough();

                    let authResponse: AuthResponse = {
                        access_token: encodeTestToken({
                            username: username,
                            exp     : addMinutes(-1)
                        })
                    };
                    http.returnValue(authResponse);

                    authService.login(username, 'password').subscribe(() => {
                        done.fail();
                    }, (fail: ErrorResponse) => {
                        expect(fail.status).toBe(500);
                        expect(postSpy.calls.mostRecent().args[0].data.get('username')).toBe(username);
                        done();
                    });
                }))();
        });

        it('login will return true if anything is fine', (done: DoneFn) => {
            fakeAsync(
                inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                    let postSpy = spyOn(http, 'post').and.callThrough();
                    let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');

                    let authResponse: AuthResponse = {
                        access_token: encodeTestToken({
                            username: username,
                            exp     : addMinutes(15)
                        })
                    };
                    http.returnValue(authResponse);

                    authService.login(username, 'password').subscribe((status: boolean) => {
                        expect(status).toBeTruthy();
                        expect(postSpy.calls.mostRecent().args[0].data.get('username')).toBe(username);
                        expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeTruthy();
                        expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME))
                            .toEqual(authResponse.access_token);
                        expect(authService.isLoggedIn()).toBeTruthy();
                        expect(authService.getLoggedUser()).toEqual(username);

                        // Clean up periodic tasks (checkAuth) and login data
                        authService.logout();

                        done();
                    }, () => {
                        done.fail();
                    });
                }))();
        });
    });

    describe('(invalid token in the local storage)', () => {
        let tokenData: TokenData;
        let token: string;
        let username = 'testUser';

        beforeEach(() => {
            tokenData = {
                username: username,
                exp     : addMinutes(-15)
            };
            token = encodeTestToken(tokenData);

            localStorage.setItem(AuthConfigConsts.DEFAULT_TOKEN_NAME, token);

            TestBed.configureTestingModule({
                providers: [
                    AuthStorageService,
                    AuthService,
                    {
                        provide : HttpService,
                        useClass: HttpServiceStub
                    }
                ]
            });
        });

        it('isLoggedIn has to return false and getLoggedUser has to fail', fakeAsync(
            inject([AuthService], (authService: AuthService) => {
                expect(authService.isLoggedIn()).toBeFalsy();
                expect(() => authService.getLoggedUser()).toThrow();
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
            }))
        );
    });

    describe('(valid token in the local storage)', () => {
        let tokenData: TokenData;
        let token: string;
        let username = 'UserA';
        let differentUsername = 'UserB';

        beforeEach(() => {
            tokenData = {
                username: username,
                exp     : addMinutes(15)
            };
            token = encodeTestToken(tokenData);

            localStorage.setItem(AuthConfigConsts.DEFAULT_TOKEN_NAME, token);

            TestBed.configureTestingModule({
                providers: [
                    AuthStorageService,
                    AuthService,
                    {
                        provide : HttpService,
                        useClass: HttpServiceStub
                    }
                ]
            });
        });

        it('isLoggedIn has to return true and getLoggedUser has to return correct user', fakeAsync(
            inject([AuthService], (authService: AuthService) => {
                expect(authService.isLoggedIn()).toBeTruthy();
                expect(authService.getLoggedUser()).toEqual(tokenData.username);
                expect(authService.getLoggedUser()).toEqual(username);
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toEqual(token);

                // Clean up periodic tasks (checkAuth) and login data
                authService.logout();
            }))
        );

        it('logout will cleanup/revert all resources', fakeAsync(
            inject([AuthService], (authService: AuthService) => {
                let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');

                authService.logout();

                expect(authService.isLoggedIn()).toBeFalsy();
                expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
                expect(() => authService.getLoggedUser()).toThrow();
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
            }))
        );

        it('checkAuth will do logout if username do not match our', fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');
                let logoutSpy = spyOn(authService, 'logout').and.callThrough();

                let statusResponse: AuthStatusResponse = {
                    username: differentUsername
                };
                http.returnValue(statusResponse);

                (authService as any).checkAuth();

                expect(authService.isLoggedIn()).toBeFalsy();
                expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
                expect(() => authService.getLoggedUser()).toThrow();
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
                expect(logoutSpy.calls.any()).toBeTruthy();
            }))
        );

        it('whenever HttpService emits "unauthorized" we have to call logout', fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');
                let logoutSpy = spyOn(authService, 'logout').and.callThrough();

                let errorResponse: ErrorResponse = {
                    status : 401,
                    message: 'Unauthorized'
                };
                http.unauthorized.emit(errorResponse);
                tick();

                expect(authService.isLoggedIn()).toBeFalsy();
                expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
                expect(() => authService.getLoggedUser()).toThrow();
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
                expect(logoutSpy.calls.any()).toBeTruthy();
            }))
        );

        it('checkAuth will do logout if http returns error', fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');
                let logoutSpy = spyOn(authService, 'logout').and.callThrough();

                let errorResponse: ErrorResponse = {
                    status : 500,
                    message: 'some error'
                };
                http.throwError(errorResponse);

                (authService as any).checkAuth();

                expect(authService.isLoggedIn()).toBeFalsy();
                expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
                expect(() => authService.getLoggedUser()).toThrow();
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
                expect(logoutSpy.calls.any()).toBeTruthy();
            }))
        );
    });

    describe('(valid token in the local storage, but almost expired)', () => {
        let tokenData: TokenData;
        let token: string;
        let username = 'testUser';

        beforeEach(() => {
            tokenData = {
                username: username,
                exp     : addMinutes(9)
            };
            token = encodeTestToken(tokenData);

            localStorage.setItem(AuthConfigConsts.DEFAULT_TOKEN_NAME, token);

            TestBed.configureTestingModule({
                providers: [
                    AuthStorageService,
                    AuthService,
                    {
                        provide : HttpService,
                        useClass: HttpServiceStub
                    }
                ]
            });
        });

        it('isLoggedIn has to return true and getLoggedUser has to return correct user', fakeAsync(
            inject([AuthService], (authService: AuthService) => {
                expect(authService.isLoggedIn()).toBeTruthy();
                expect(authService.getLoggedUser()).toEqual(tokenData.username);
                expect(authService.getLoggedUser()).toEqual(username);
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toEqual(token);

                // Clean up periodic tasks (checkAuth) and login data
                authService.logout();
            }))
        );

        it('checkAuth will do logout for expired token', fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');
                let logoutSpy = spyOn(authService, 'logout').and.callThrough();

                let errorResponse: ErrorResponse = {
                    status : 401,
                    message: 'Expired'
                };
                http.throwError(errorResponse);

                (authService as any).checkAuth();

                expect(authService.isLoggedIn()).toBeFalsy();
                expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
                expect(() => authService.getLoggedUser()).toThrow();
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
                expect(logoutSpy.calls.any()).toBeTruthy();
            }))
        );

        it('checkAuth will do logout for missing token', fakeAsync(
            inject([AuthService], (authService: AuthService) => {
                let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');
                let logoutSpy = spyOn(authService, 'logout').and.callThrough();

                localStorage.removeItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);

                (authService as any).checkAuth();

                expect(authService.isLoggedIn()).toBeFalsy();
                expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
                expect(() => authService.getLoggedUser()).toThrow();
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
                expect(logoutSpy.calls.any()).toBeTruthy();
            }))
        );

        xit('checkAuth will renew token', fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');

                let newToken = encodeTestToken({
                    username: username,
                    exp     : addMinutes(15)
                });
                let authResponse: AuthResponse = {
                    access_token: newToken
                };
                http.returnValue(authResponse);
                let statusRespons: AuthStatusResponse = {
                    username: username
                };
                http.returnValue(statusRespons);

                (authService as any).checkAuth();

                expect(authService.isLoggedIn()).toBeTruthy();
                expect(authService.getLoggedUser()).toEqual(tokenData.username);
                expect(authService.getLoggedUser()).toEqual(username);
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toEqual(newToken);
                expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeTruthy();
            }))
        );
    });
});