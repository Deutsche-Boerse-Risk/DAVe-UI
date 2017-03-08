import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

import {TestBed, async, ComponentFixtureAutoDetect, fakeAsync} from "@angular/core/testing";

import {AuthServiceStub, RouterStub, LoginPage} from "../../testing";

import {LoginComponent} from "./login.component";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs/Observable";

describe('Login component', () => {
    let page: LoginPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                FormsModule
            ],
            declarations: [LoginComponent],
            providers: [
                {
                    provide: AuthService, useClass: AuthServiceStub
                },
                {
                    provide: Router, useClass: RouterStub
                },
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new LoginPage(TestBed.createComponent(LoginComponent));
        page.detectChanges();
    }));

    it('shows login form', () => {
        expect(page.formElement).not.toBeNull('form is shown');
        expect(page.usernameElement).not.toBeNull('username is shown');
        expect(page.passwordElement).not.toBeNull('password is shown');
        expect(page.loginButtonElement).not.toBeNull('login button is shown');
    });

    it('form bindings work as expected',
        fakeAsync(() => {
            // put our test string to the input element
            let username = 'testUser';
            let password = 'testPassword';

            let routerStub: RouterStub = TestBed.get(Router);
            let navigateSpy = spyOn(routerStub, 'navigate');

            page.username = username;
            // expect it to be the uppercase version
            expect(page.component.username).toEqual(username);

            page.password = password;
            // expect it to be the uppercase version
            expect(page.component.password).toEqual(password);

            page.clickLogin();

            expect(page.formElement).toBeNull('form is hidden');

            expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
            expect(page.alertSucessMessage).toContain('Successfully logged in as ' + username + '.');
        }));

    it('form will show an error message when false is returned from server',
        fakeAsync(() => {
            // put our test string to the input element
            let username = 'testUser';
            let password = 'testPassword';

            let authServiceStub: AuthServiceStub = TestBed.get(AuthService);
            spyOn(authServiceStub, 'login').and.returnValue(Observable.of(false));

            page.username = username;
            // expect it to be the uppercase version
            expect(page.component.username).toEqual(username);

            page.password = password;
            // expect it to be the uppercase version
            expect(page.component.password).toEqual(password);

            page.clickLogin();

            expect(page.formElement).not.toBeNull('form is shown');
            expect(page.usernameElement).not.toBeNull('username is shown');
            expect(page.passwordElement).not.toBeNull('password is shown');
            expect(page.loginButtonElement).not.toBeNull('login button is shown');

            expect(page.errorMessage).toContain('Authentication failed. Server didn\'t generate a token.');
        }));

    it('form will navigate correctly once we have a request path available',
        fakeAsync(() => {
            // put our test string to the input element
            let username = 'testUser';
            let password = 'testPassword';
            let testURL = 'some url';

            let authServiceStub: AuthServiceStub = TestBed.get(AuthService);
            authServiceStub.authRequestedPath = testURL;

            let routerStub: RouterStub = TestBed.get(Router);
            let navigateSpy = spyOn(routerStub, 'navigateByUrl');

            page.username = username;
            // expect it to be the uppercase version
            expect(page.component.username).toEqual(username);

            page.password = password;
            // expect it to be the uppercase version
            expect(page.component.password).toEqual(password);

            page.clickLogin();

            expect(page.formElement).toBeNull('form is hidden');

            expect(navigateSpy).toHaveBeenCalledWith(testURL);
            expect(page.alertSucessMessage).toContain('Successfully logged in as ' + username + '.');
        }));

    it('form will show an error message when false is returned from server',
        fakeAsync(() => {
            // put our test string to the input element
            let username = 'testUser';
            let password = 'testPassword';

            let authServiceStub: AuthServiceStub = TestBed.get(AuthService);
            spyOn(authServiceStub, 'login').and.returnValue(Observable.throw({
                status: 401,
                message: 'some message'
            }));

            page.username = username;
            // expect it to be the uppercase version
            expect(page.component.username).toEqual(username);

            page.password = password;
            // expect it to be the uppercase version
            expect(page.component.password).toEqual(password);

            page.clickLogin();

            expect(page.formElement).not.toBeNull('form is shown');
            expect(page.usernameElement).not.toBeNull('username is shown');
            expect(page.passwordElement).not.toBeNull('password is shown');
            expect(page.loginButtonElement).not.toBeNull('login button is shown');

            expect(page.errorMessage).toContain('Authentication failed. Is the username and password correct?');
        }));
});