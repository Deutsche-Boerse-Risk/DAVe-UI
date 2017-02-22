import {TestBed, inject, fakeAsync, discardPeriodicTasks, tick} from "@angular/core/testing";

import {HttpServiceStub} from "../../testing/http.service.stub";
import {encodeTestToken} from "angular2-jwt/angular2-jwt-test-helpers";

import {AuthConfigConsts} from "angular2-jwt";

import {AuthService} from "./auth.service";
import {HttpService, ErrorResponse} from "../http.service";

function addMinutes(minutes: number): number {
    return new Date(Date.now() + minutes * 60000).getTime() / 1000;
}

describe('Auth service: nothing in the local storage:', () => {
    beforeEach(() => {
        localStorage.removeItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                {
                    provide: HttpService, useClass: HttpServiceStub
                }
            ]
        });
    });

    it('isLoggedIn has to return false and getLoggedUser has to fail', fakeAsync(
        inject([AuthService], (authService: AuthService) => {
            expect(authService.isLoggedIn()).toBeFalsy();
            expect(() => authService.getLoggedUser()).toThrow();
            expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();

            // Clean up periodic tasks (checkAuth)
            discardPeriodicTasks();
        }))
    );

    it('login will throw error if no token was provided by server', (done: DoneFn) => {
        fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                http.returnValue({});

                let postSpy = spyOn(http, 'post').and.callThrough();
                let username = 'UserA';

                authService.login(username, 'password').subscribe(() => {
                    done.fail();
                }, (fail: ErrorResponse) => {
                    expect(fail.status).toBe(401);
                    expect(postSpy.calls.mostRecent().args[0].data.username).toBe(username);
                    done();
                });

                // Clean up periodic tasks (checkAuth)
                discardPeriodicTasks();
            }))();
    });

    it('login will throw error if invalid token was provided by server', (done: DoneFn) => {
        fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                http.returnValue({
                    token: 'invalidString'
                });

                let postSpy = spyOn(http, 'post').and.callThrough();
                let username = 'UserA';

                authService.login(username, 'password').subscribe(() => {
                    done.fail();
                }, (fail: ErrorResponse) => {
                    expect(fail.status).toBe(500);
                    expect(postSpy.calls.mostRecent().args[0].data.username).toBe(username);
                    done();
                });

                // Clean up periodic tasks (checkAuth)
                discardPeriodicTasks();
            }))();
    });

    it('login will throw error if token with different username was provided by server', (done: DoneFn) => {
        fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                http.returnValue({
                    token: encodeTestToken({
                        username: 'UserB'
                    })
                });

                let postSpy = spyOn(http, 'post').and.callThrough();
                let username = 'UserA';

                authService.login(username, 'password').subscribe(() => {
                    done.fail();
                }, (fail: ErrorResponse) => {
                    expect(fail.status).toBe(500);
                    expect(postSpy.calls.mostRecent().args[0].data.username).toBe(username);
                    done();
                });

                // Clean up periodic tasks (checkAuth)
                discardPeriodicTasks();
            }))();
    });

    it('login will throw error if already expired token was provided by server', (done: DoneFn) => {
        fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                let postSpy = spyOn(http, 'post').and.callThrough();
                let username = 'UserA';

                http.returnValue({
                    token: encodeTestToken({
                        username: username,
                        exp: addMinutes(-1)
                    })
                });

                authService.login(username, 'password').subscribe(() => {
                    done.fail();
                }, (fail: ErrorResponse) => {
                    expect(fail.status).toBe(500);
                    expect(postSpy.calls.mostRecent().args[0].data.username).toBe(username);
                    done();
                });

                // Clean up periodic tasks (checkAuth)
                discardPeriodicTasks();
            }))();
    });

    it('login will return true if anything is fine', (done: DoneFn) => {
        fakeAsync(
            inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
                let postSpy = spyOn(http, 'post').and.callThrough();
                let username = 'UserA';
                let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');

                let token = {
                    token: encodeTestToken({
                        username: username,
                        exp: addMinutes(15)
                    })
                };
                http.returnValue(token);

                authService.login(username, 'password').subscribe((status: boolean) => {
                    expect(status).toBeTruthy();
                    expect(postSpy.calls.mostRecent().args[0].data.username).toBe(username);
                    expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeTruthy();
                    expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toEqual(token.token);
                    expect(authService.isLoggedIn()).toBeTruthy();
                    let loggedUser = authService.getLoggedUser();
                    expect(loggedUser).toEqual(username);
                    done();
                }, () => {
                    done.fail();
                });

                // Clean up periodic tasks (checkAuth)
                discardPeriodicTasks();
            }))();
    });
});

describe('Auth service: invalid token in the local storage:', () => {
    let tokenData = {
        username: 'testUser',
        exp: addMinutes(-15)
    };
    let token = encodeTestToken(tokenData);

    beforeEach(() => {
        localStorage.setItem(AuthConfigConsts.DEFAULT_TOKEN_NAME, token);

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                {
                    provide: HttpService, useClass: HttpServiceStub
                }
            ]
        });
    });

    it('isLoggedIn has to return false and getLoggedUser has to fail', fakeAsync(
        inject([AuthService], (authService: AuthService) => {
            expect(authService.isLoggedIn()).toBeFalsy();
            expect(() => authService.getLoggedUser()).toThrow();
            expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();

            // Clean up periodic tasks (checkAuth)
            discardPeriodicTasks();
        }))
    );
});

describe('Auth service: valid token in the local storage:', () => {
    let tokenData = {
        username: 'testUser',
        exp: addMinutes(15)
    };
    let token = encodeTestToken(tokenData);

    beforeEach(() => {
        localStorage.setItem(AuthConfigConsts.DEFAULT_TOKEN_NAME, token);

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                {
                    provide: HttpService, useClass: HttpServiceStub
                }
            ]
        });
    });

    it('isLoggedIn has to return true and getLoggedUser has to return correct user', fakeAsync(
        inject([AuthService], (authService: AuthService) => {
            expect(authService.isLoggedIn()).toBeTruthy();
            let username = authService.getLoggedUser();
            expect(username).toEqual(tokenData.username);
            expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toEqual(token);

            // Clean up periodic tasks (checkAuth)
            discardPeriodicTasks();
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

            // Clean up periodic tasks (checkAuth)
            discardPeriodicTasks();
        }))
    );

    it('checkAuth will do logout if username do not match our', fakeAsync(
        inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
            let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');
            let logoutSpy = spyOn(authService, 'logout').and.callThrough();

            http.returnValue({
                username: 'anotherTestUser'
            });

            (authService as any).checkAuth();

            expect(authService.isLoggedIn()).toBeFalsy();
            expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
            expect(() => authService.getLoggedUser()).toThrow();
            expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
            expect(logoutSpy.calls.any()).toBeTruthy();

            // Clean up periodic tasks (checkAuth)
            discardPeriodicTasks();
        }))
    );

    it('whenever HttpService emits "unauthorized" we have to call logout', fakeAsync(
        inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
            let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');
            let logoutSpy = spyOn(authService, 'logout').and.callThrough();

            http.unauthorized.emit({
                status: 401,
                message: 'Unauthorized'
            });
            tick();

            expect(authService.isLoggedIn()).toBeFalsy();
            expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
            expect(() => authService.getLoggedUser()).toThrow();
            expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
            expect(logoutSpy.calls.any()).toBeTruthy();

            // Clean up periodic tasks (checkAuth)
            discardPeriodicTasks();
        }))
    );

    it('checkAuth will do logout if http returns error', fakeAsync(
        inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
            let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');
            let logoutSpy = spyOn(authService, 'logout').and.callThrough();

            http.throwError({
                status: 500,
                message: 'some error'
            });

            (authService as any).checkAuth();

            expect(authService.isLoggedIn()).toBeFalsy();
            expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
            expect(() => authService.getLoggedUser()).toThrow();
            expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
            expect(logoutSpy.calls.any()).toBeTruthy();

            // Clean up periodic tasks (checkAuth)
            discardPeriodicTasks();
        }))
    );
});

describe('Auth service: valid token (but almost expired) in the local storage:', () => {
    let tokenData = {
        username: 'testUser',
        exp: addMinutes(9)
    };
    let token = encodeTestToken(tokenData);

    beforeEach(() => {
        localStorage.setItem(AuthConfigConsts.DEFAULT_TOKEN_NAME, token);

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                {
                    provide: HttpService, useClass: HttpServiceStub
                }
            ]
        });
    });

    it('isLoggedIn has to return true and getLoggedUser has to return correct user', fakeAsync(
        inject([AuthService], (authService: AuthService) => {
            expect(authService.isLoggedIn()).toBeTruthy();
            let username = authService.getLoggedUser();
            expect(username).toEqual(tokenData.username);
            expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toEqual(token);

            // Clean up periodic tasks (checkAuth)
            discardPeriodicTasks();
        }))
    );

    it('checkAuth will do logout for expired token', fakeAsync(
        inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
            let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');
            let logoutSpy = spyOn(authService, 'logout').and.callThrough();

            http.throwError({
                status: 401,
                message: 'Expired'
            });

            (authService as any).checkAuth();

            expect(authService.isLoggedIn()).toBeFalsy();
            expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeFalsy();
            expect(() => authService.getLoggedUser()).toThrow();
            expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toBeNull();
            expect(logoutSpy.calls.any()).toBeTruthy();

            // Clean up periodic tasks (checkAuth)
            discardPeriodicTasks();
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

            // Clean up periodic tasks (checkAuth)
            discardPeriodicTasks();
        }))
    );

    it('checkAuth will renew token', fakeAsync(
        inject([AuthService, HttpService], (authService: AuthService, http: HttpServiceStub<any>) => {
            let loggedInChangeSpy = spyOn(authService.loggedInChange, 'emit');

            let newToken = encodeTestToken({
                username: 'testUser',
                exp: addMinutes(15)
            });
            http.returnValue({
                token: newToken
            });
            http.returnValue({
                username: 'testUser'
            });

            (authService as any).checkAuth();

            expect(authService.isLoggedIn()).toBeTruthy();
            let username = authService.getLoggedUser();
            expect(username).toEqual(tokenData.username);
            expect(localStorage.getItem(AuthConfigConsts.DEFAULT_TOKEN_NAME)).toEqual(newToken);
            expect(loggedInChangeSpy.calls.mostRecent().args[0]).toBeTruthy();

            // Clean up periodic tasks (checkAuth)
            discardPeriodicTasks();
        }))
    );
});