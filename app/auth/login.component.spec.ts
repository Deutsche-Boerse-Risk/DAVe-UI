import {DebugElement} from "@angular/core";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {By, BrowserModule} from "@angular/platform-browser";

import {ComponentFixture, TestBed, async, ComponentFixtureAutoDetect, fakeAsync, tick} from "@angular/core/testing";

import {AuthServiceStub} from "../../testing/auth.service.stub";
import {RouterStub} from "../../testing/router.stub";
import {click, setNgModelValue, advance} from "../../testing/index";

import {LoginComponent} from "./login.component";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs/Observable";

class LoginPage {

    public component: LoginComponent;
    public debugElement: DebugElement;

    constructor(public fixture: ComponentFixture<LoginComponent>) {
        this.component = this.fixture.componentInstance;
        this.debugElement = this.fixture.debugElement;
    }

    public get formElement(): DebugElement {
        return this.debugElement.query(By.css('form'));
    }

    public get usernameElement(): DebugElement {
        return this.formElement.query(By.css('input[name=username]'));
    }

    public get passwordElement(): DebugElement {
        return this.formElement.query(By.css('input[name=password]'));
    }

    public get loginButtonElement(): DebugElement {
        return this.formElement.query(By.css('.btn-primary'));
    }

    public get alertSucessElement(): DebugElement {
        return this.debugElement.query(By.css('.alert.alert-success'));
    }

    public get alertSucessMessage(): string {
        return this.alertSucessElement.nativeElement.textContent;
    }

    public get errorMessageElement(): DebugElement {
        return this.debugElement.query(By.css('.alert.alert-danger'));
    }

    public get errorMessage(): string {
        return this.errorMessageElement.nativeElement.textContent;
    }

    public clickLogin() {
        click(this.loginButtonElement.nativeElement);
        advance(this.fixture);
    }
}

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
        page.fixture.detectChanges();
        tick();
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

            setNgModelValue(page.usernameElement, username);
            // expect it to be the uppercase version
            expect(page.component.username).toEqual(username);

            setNgModelValue(page.passwordElement, password);
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

            setNgModelValue(page.usernameElement, username);
            // expect it to be the uppercase version
            expect(page.component.username).toEqual(username);

            setNgModelValue(page.passwordElement, password);
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

            setNgModelValue(page.usernameElement, username);
            // expect it to be the uppercase version
            expect(page.component.username).toEqual(username);

            setNgModelValue(page.passwordElement, password);
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

            setNgModelValue(page.usernameElement, username);
            // expect it to be the uppercase version
            expect(page.component.username).toEqual(username);

            setNgModelValue(page.passwordElement, password);
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