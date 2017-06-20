// import {NO_ERRORS_SCHEMA} from '@angular/core';
//
// import {async, fakeAsync, inject, TestBed} from '@angular/core/testing';
//
// import {AppComponentPage} from '../testing';
//
// import {AppComponent} from './app.component';
// import {AuthService} from '@dbg-riskit/dave-ui-auth';
// import {AuthServiceStub} from '@dbg-riskit/dave-ui-testing';
//
// xdescribe('AppComponent', () => {
//
//     let page: AppComponentPage;
//
//     compileTestBed(() => {
//         return TestBed.configureTestingModule({
//             declarations: [AppComponent],
//             providers   : [
//                 {
//                     provide : AuthService,
//                     useClass: AuthServiceStub
//                 }
//             ],
//             schemas     : [NO_ERRORS_SCHEMA]
//         }).compileComponents();
//     });
//
//     beforeEach(fakeAsync(() => {
//         page = new AppComponentPage(TestBed.createComponent(AppComponent));
//         page.detectChanges();
//     }));
//
//     it('does not have menu shown by default', fakeAsync(() => {
//         expect(page.appMenu).toBeNull('Menu not shown');
//         expect(page.loginMenu).toBeNull('Login menu not shown');
//     }));
//
//     it('does have menu shown once logged in', fakeAsync(inject([AuthService], (auth: AuthServiceStub) => {
//         auth.login('user', 'pass');
//         page.detectChanges();
//
//         expect(page.appMenu).not.toBeNull('Menu shown');
//         expect(page.loginMenu).not.toBeNull('Login menu shown');
//     })));
//
//     it('does have router outlet', fakeAsync(() => {
//         expect(page.outlet).not.toBeNull('Router outlet shown');
//     }));
// });