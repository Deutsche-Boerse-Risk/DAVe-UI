import {BrowserModule} from '@angular/platform-browser';
import {Router} from '@angular/router';

import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {
    AuthServiceStub,
    compileTestBed,
    GoogleChartStub,
    HttpAsyncServiceStub,
    NoopAnimationsCommonViewModule,
    RouterLinkStubDirective,
    RouterStub
} from '@dbg-riskit/dave-ui-testing';

import {AUTH_PROVIDER} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generateLiquiGroupMargin, TreeMapPage} from '@dave/testing';

import {LiquiGroupMarginService} from './liqui.group.margin.service';

import {LiquiGroupMarginTreemapComponent} from './liqui.group.margin.treemap.component';
import {LiquiGroupMarginServerData} from './liqui.group.margin.types';
import {ROUTES} from '../routes/routing.paths';
import {PeriodicHttpService} from '../periodic.http.service';

describe('Liquidation Group Margin TreeMap component', () => {
    let page: TreeMapPage;

    compileTestBed(() => {
        return TestBed.configureTestingModule({
            imports     : [
                BrowserModule,
                NoopAnimationsCommonViewModule
            ],
            declarations: [
                LiquiGroupMarginTreemapComponent,
                RouterLinkStubDirective,
                GoogleChartStub
            ],
            providers   : [
                LiquiGroupMarginService,
                {
                    provide : HttpService,
                    useClass: HttpAsyncServiceStub
                },
                {
                    provide : Router,
                    useClass: RouterStub
                },
                {
                    provide : AUTH_PROVIDER,
                    useClass: AuthServiceStub
                },
                PeriodicHttpService,
                ErrorCollectorService
            ]
        }).compileComponents();
    }, () => {
        page.destroy();
        page = null;
    });

    beforeEach(fakeAsync(inject([HttpService, LiquiGroupMarginService],
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>, service: LiquiGroupMarginService) => {
            // Generate test data
            http.returnValue(generateLiquiGroupMargin());
            // Create component
            page = new TreeMapPage(TestBed.createComponent(LiquiGroupMarginTreemapComponent));

            //We have to detach the timer and reatach it later in test to be in correct Zone
            // noinspection JSDeprecatedSymbols
            service.destroyPeriodicTimer();
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService, LiquiGroupMarginService],
        (http: HttpAsyncServiceStub<LiquiGroupMarginServerData[]>, service: LiquiGroupMarginService) => {
            // Attach the timer
            service.setupPeriodicTimer();

            // Init component
            page.detectChanges();

            expect(page.initialLoadVisible)
                .toBeTruthy('Initial load component visible.');
            expect(page.noDataVisible)
                .toBeFalsy('No data component not visible.');
            expect(page.googleChartVisible)
                .toBeFalsy('Chart component not visible.');

            // Return no data
            http.popReturnValue(); // Remove from queue
            http.returnValue([]); // Push empty array
            page.advanceHTTP();

            expect(page.initialLoadVisible)
                .toBeFalsy('Initial load component not visible.');
            expect(page.noDataVisible)
                .toBeTruthy('No data component visible.');
            expect(page.googleChartVisible)
                .toBeFalsy('Chart component not visible.');

            // Discard the service timer
            // noinspection JSDeprecatedSymbols
            service.destroyPeriodicTimer();
        })));

    it('displays chart correctly', fakeAsync(inject([LiquiGroupMarginService],
        (service: LiquiGroupMarginService) => {
            // Attach the timer
            service.setupPeriodicTimer();

            // Init component
            page.detectChanges();

            expect(page.initialLoadVisible).toBeTruthy('Initial load component visible.');
            expect(page.noDataVisible).toBeFalsy('No data component not visible.');
            expect(page.googleChartVisible).toBeFalsy('Chart component not visible.');

            // Return data
            page.advanceHTTP();

            expect(page.initialLoadVisible).toBeFalsy('Initial load component not visible.');
            expect(page.noDataVisible).toBeFalsy('No data component not visible.');
            expect(page.googleChartVisible).toBeTruthy('Chart component visible.');

            // Discard the service timer
            // noinspection JSDeprecatedSymbols
            service.destroyPeriodicTimer();
        })));

    it('detail links navigates', fakeAsync(inject([LiquiGroupMarginService],
        (service: LiquiGroupMarginService) => {
            // Attach the timer
            service.setupPeriodicTimer();

            // Init component
            page.detectChanges();

            //Does not exists, yet
            expect(() => page.link.click()).toThrow();

            // Return data
            page.advanceHTTP();

            // Already shown
            let navigateSpy = spyOn(page.link.stub, 'onClick').and.callThrough();
            expect(() => page.link.click()).not.toThrow();

            // Clicked correctly
            expect(navigateSpy).toHaveBeenCalled();
            expect(page.link.stub.navigatedTo).toEqual(ROUTES.LIQUI_GROUP_MARGIN_LATEST);

            // Discard the service timer
            // noinspection JSDeprecatedSymbols
            service.destroyPeriodicTimer();
        })));

    xit('check data', fakeAsync(() => {
    }));

    xit('chart selection works', fakeAsync(() => {
    }));
});