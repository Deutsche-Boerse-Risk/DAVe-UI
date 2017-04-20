import {TestBed, inject, fakeAsync, tick} from '@angular/core/testing';

import {HttpServiceStub} from '../../testing';

import {encodeTestToken} from 'angular2-jwt/angular2-jwt-test-helpers';

import {AuthConfigConsts} from 'angular2-jwt';

import {AuthService, TokenData, AuthResponse, AuthStatusResponse, AUTH_CHECK_INTERVAL} from './auth.service';
import {HttpService, ErrorResponse} from '../http.service';
import {AuthStorageService, REFRESH_TOKEN_NAME} from './auth.storage.service';

function addMinutes(minutes: number): number {
    return new Date(Date.now() + minutes * 60000).getTime() / 1000;
}

describe('Auth service', () => {

    afterEach(inject([AuthStorageService], (storage: AuthStorageService) => {
        // Cleanup storage
        storage.clear();
    }));

    function prepareTestBed() {
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
    }

    describe('(nothing in the local storage)', () => {
        let username = 'UserA';

        beforeEach(prepareTestBed);

        it('isLoggedIn has to return false and getLoggedUser has to fail', fakeAsync(
            inject([AuthService, AuthStorageService], (authService: AuthService, storage: AuthStorageService) => {
                expect(authService.isLoggedIn()).toBeFalsy();
                expect(() => authService.getLoggedUser()).toThrow();
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
                expect(storage.id_token).toBeNull();
            }))
        );

        it('login will throw error if no token was provided by server', fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                http.returnValue({});

                let postSpy = spyOn(http, 'post').and.callThrough();

                authService.login(username, 'password').subscribe(() => {
                    fail('Auth service does not throw error when expected');
                }, (fail: ErrorResponse) => {
                    expect(fail.status).toBe(401);
                    expect(postSpy.calls.mostRecent().args[0].data.get('username')).toBe(username);
                });
            })));

        it('login will throw error if invalid token was provided by server', fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                let authResponse: AuthResponse = {
                    access_token : 'invalidString',
                    refresh_token: 'invalidString'
                };
                http.returnValue(authResponse);

                let postSpy = spyOn(http, 'post').and.callThrough();

                authService.login(username, 'password').subscribe(() => {
                    fail('Auth service does not throw error when expected');
                }, (fail: ErrorResponse) => {
                    expect(fail.status).toBe(500);
                    expect(postSpy.calls.mostRecent().args[0].data.get('username')).toBe(username);
                });
            })));

        it('login will throw error if token with different username was provided by server', fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {

                let token = encodeTestToken({
                    username: 'UserB'
                });
                let authResponse: AuthResponse = {
                    access_token : token,
                    refresh_token: token
                };
                http.returnValue(authResponse);

                let postSpy = spyOn(http, 'post').and.callThrough();

                authService.login(username, 'password').subscribe(() => {
                    fail('Auth service does not throw error when expected');
                }, (fail: ErrorResponse) => {
                    expect(fail.status).toBe(500);
                    expect(postSpy.calls.mostRecent().args[0].data.get('username')).toBe(username);
                });
            })));

        it('login will throw error if already expired token was provided by server', fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                let postSpy = spyOn(http, 'post').and.callThrough();

                let token = encodeTestToken({
                    username: username,
                    exp     : addMinutes(-1)
                });
                let authResponse: AuthResponse = {
                    access_token : token,
                    refresh_token: token
                };
                http.returnValue(authResponse);

                authService.login(username, 'password').subscribe(() => {
                    fail('Auth service does not throw error when expected');
                }, (fail: ErrorResponse) => {
                    expect(fail.status).toBe(500);
                    expect(postSpy.calls.mostRecent().args[0].data.get('username')).toBe(username);
                });
            })));

        it('login will return true if anything is fine', fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                let postSpy = spyOn(http, 'post').and.callThrough();
                let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');

                let token = encodeTestToken({
                    username: username,
                    exp     : addMinutes(15)
                });
                let authResponse: AuthResponse = {
                    access_token : token,
                    refresh_token: token
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
                }, () => {
                    fail('Auth service error thrown when not expected');
                });
            })));

        it('checkAuth will not be called after AUTH_CHECK_INTERVAL timeout and will be called once logged in',
            fakeAsync(
                inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                    let checkAuthSpy = spyOn(authService as any, 'checkAuth').and.callThrough();

                    // Trigger check interval
                    tick(AUTH_CHECK_INTERVAL);

                    expect(checkAuthSpy.calls.any()).toBeFalsy();

                    let token = encodeTestToken({
                        username: username,
                        exp     : addMinutes(15)
                    });
                    let authResponse: AuthResponse = {
                        access_token : token,
                        refresh_token: token
                    };
                    http.returnValue(authResponse);

                    authService.login(username, 'password').subscribe(() => {
                        // Trigger check interval
                        tick(AUTH_CHECK_INTERVAL);

                        expect(checkAuthSpy.calls.any()).toBeTruthy();

                        authService.logout();
                    }, () => {
                        fail('Auth service error thrown when not expected');
                    });
                }))
        );
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
            localStorage.setItem(REFRESH_TOKEN_NAME, token);
        });

        beforeEach(prepareTestBed);

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
            localStorage.setItem(REFRESH_TOKEN_NAME, token);
        });

        beforeEach(prepareTestBed);

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

                // Trigger check interval
                tick(AUTH_CHECK_INTERVAL);

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

                // Trigger check interval
                tick(AUTH_CHECK_INTERVAL);

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
        let anotherUsername = 'anotherUserName';
        let exp = 2;

        beforeEach(() => {
            tokenData = {
                username: username,
                exp     : addMinutes(exp)
            };
            token = encodeTestToken(tokenData);
            localStorage.setItem(AuthConfigConsts.DEFAULT_TOKEN_NAME, token);
            localStorage.setItem(REFRESH_TOKEN_NAME, token);
        });

        beforeEach(prepareTestBed);

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

                // Trigger check interval
                tick(AUTH_CHECK_INTERVAL);

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

                // Trigger check interval
                tick(AUTH_CHECK_INTERVAL);

                expect(authService.isLoggedIn()).toBeFalsy();
                expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
                expect(() => authService.getLoggedUser()).toThrow();
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
                expect(logoutSpy.calls.any()).toBeTruthy();
            }))
        );

        it('refreshToken will renew token', fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');
                let logoutSpy = spyOn(authService, 'logout').and.callThrough();

                // For auth check
                let statusResponse: AuthStatusResponse = {
                    username: username
                };
                http.returnValue(statusResponse);

                // For refresh
                let newToken = encodeTestToken({
                    username: username,
                    exp     : addMinutes(11)
                });
                let authResponse: AuthResponse = {
                    access_token : newToken,
                    refresh_token: newToken
                };
                http.returnValue(authResponse);

                // Trigger refresh (after "exp" minutes - 30 seconds)
                tick((exp * 60 - 30) * 1000);

                expect(authService.isLoggedIn()).toBeTruthy();
                expect(authService.getLoggedUser()).toEqual(tokenData.username);
                expect(authService.getLoggedUser()).toEqual(username);
                expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toEqual(newToken);
                expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeTruthy();
                expect(logoutSpy.calls.any()).toBeFalsy();

                // Logout to discard timers
                authService.logout();
            }))
        );

        it('refreshToken will do logout if token is for different user', fakeAsync(
            inject([AuthService, AuthStorageService, HttpService],
                (authService: AuthService, storage: AuthStorageService, http: HttpServiceStub<any>) => {
                    let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');
                    let logoutSpy = spyOn(authService, 'logout').and.callThrough();

                    // For auth check
                    let statusResponse: AuthStatusResponse = {
                        username: username
                    };
                    http.returnValue(statusResponse);

                    // For refresh
                    let newToken = encodeTestToken({
                        username: anotherUsername,
                        exp     : addMinutes(11)
                    });
                    let authResponse: AuthResponse = {
                        access_token : newToken,
                        refresh_token: newToken
                    };
                    http.returnValue(authResponse);

                    // Trigger refresh (after "exp" minutes - 30 seconds)
                    tick((exp * 60 - 30) * 1000);

                    expect(authService.isLoggedIn()).toBeFalsy();
                    expect(() => authService.getLoggedUser()).toThrow();
                    expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
                    expect(storage.id_token).toBeNull();
                    expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
                    expect(logoutSpy.calls.any()).toBeTruthy();
                }))
        );

        it('refreshToken will do logout for HTTP error', fakeAsync(
            inject([AuthService, AuthStorageService, HttpService],
                (authService: AuthService, storage: AuthStorageService, http: HttpServiceStub<any>) => {
                    let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');
                    let logoutSpy = spyOn(authService, 'logout').and.callThrough();

                    // For auth check
                    let statusResponse: AuthStatusResponse = {
                        username: username
                    };
                    http.returnValue(statusResponse);

                    tick(AUTH_CHECK_INTERVAL);

                    storage.refresh_token = null;

                    // For refresh
                    http.throwError({
                        status : 405,
                        message: 'Error'
                    });

                    // Trigger refresh (after "exp" minutes - 30 seconds)
                    tick((exp * 60 - 30) * 1000 - AUTH_CHECK_INTERVAL);

                    expect(() => authService.getLoggedUser()).toThrow();
                    expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
                    expect(storage.id_token).toBeNull();
                    expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
                    expect(logoutSpy.calls.any()).toBeTruthy();
                }))
        );

        it('refreshToken will do logout if no refresh token is stored in storage', fakeAsync(
            inject([AuthService, AuthStorageService, HttpService],
                (authService: AuthService, storage: AuthStorageService, http: HttpServiceStub<any>) => {
                    let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');
                    let logoutSpy = spyOn(authService, 'logout').and.callThrough();

                    // For auth check
                    let statusResponse: AuthStatusResponse = {
                        username: username
                    };
                    http.returnValue(statusResponse);
                    tick(AUTH_CHECK_INTERVAL);

                    storage.clear();

                    // Trigger refresh (after "exp" minutes - 30 seconds)
                    tick((exp * 60 - 30) * 1000 - AUTH_CHECK_INTERVAL);

                    expect(() => authService.getLoggedUser()).toThrow();
                    expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
                    expect(storage.id_token).toBeNull();
                    expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
                    expect(logoutSpy.calls.any()).toBeTruthy();
                }))
        );
    });
});