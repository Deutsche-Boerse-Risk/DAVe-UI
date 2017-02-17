import {Router, RouterStateSnapshot} from "@angular/router";
import {TestBed, inject, async} from "@angular/core/testing";

import {RouterStub} from "../../testing/router.stub";

import {AuthGuard} from "./auth.routing.guard";
import {AuthService} from "./auth.service";

class AuthStubService {

    public isLoggedIn(): boolean {
        return false;
    }
}

describe('Auth routing guard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthGuard,
                {
                    provide: AuthService, useClass: AuthStubService
                },
                {
                    provide: Router, useClass: RouterStub
                }
            ]
        });
    });

    it('has to return true and never navigate if logged in', async(
        inject([AuthGuard, AuthService, Router], (routingGuard: AuthGuard, authService: AuthService, router: Router) => {
            let authSpy = spyOn(authService, 'isLoggedIn');
            authSpy.and.returnValue(true);

            let routerSpy = spyOn(router, 'navigate');

            let guardValue = routingGuard.canActivateChild(null, null);

            expect(guardValue).toBeTruthy();
            expect(routerSpy.calls.any()).toBeFalsy();
        }))
    );

    it('has to return false, store current location and navigate to login if not logged in', async(
        inject([AuthGuard, AuthService, Router], (routingGuard: AuthGuard, authService: AuthService, router: Router) => {
            let authSpy = spyOn(authService, 'isLoggedIn');
            authSpy.and.returnValue(false);

            let routerSpy = spyOn(router, 'navigate');

            let state: RouterStateSnapshot = {url: '/test/url', root: null};

            let guardValue = routingGuard.canActivateChild(null, state);

            expect(guardValue).toBeFalsy();
            expect(routerSpy.calls.any()).toBeTruthy();
            expect(routerSpy.calls.mostRecent().args[0]).toEqual(['/login']);
            expect(authService.authRequestedPath).toBe(state.url);
        }))
    );
});