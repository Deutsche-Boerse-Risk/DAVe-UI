import {BrowserModule} from '@angular/platform-browser';

import {fakeAsync, inject, TestBed} from '@angular/core/testing';

import {
    AuthServiceStub,
    compileTestBed,
    HttpAsyncServiceStub,
    NoopAnimationsCommonViewModule
} from '@dbg-riskit/dave-ui-testing';

import {AUTH_PROVIDER, ErrorType} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generatePoolMarginLatest, Panel, PoolMarginSummaryPage} from '@dave/testing';

import {PeriodicHttpService} from '../periodic.http.service';

import {PoolMarginServerData} from './pool.margin.types';
import {PoolMarginService} from './pool.margin.service';

import {PoolMarginLatestSummaryComponent} from './pool.margin.latest.summary.component';

describe('Pool Margin summary', () => {
    let page: PoolMarginSummaryPage;

    let labels = ['Margin Shortfall/Surplus', 'Margin Requirement', 'Collateral', 'Cash Balance'];

    compileTestBed(() => {
        return TestBed.configureTestingModule({
            imports     : [
                BrowserModule,
                NoopAnimationsCommonViewModule
            ],
            declarations: [
                PoolMarginLatestSummaryComponent
            ],
            providers   : [
                PoolMarginService,
                {
                    provide : HttpService,
                    useClass: HttpAsyncServiceStub
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

    beforeEach(fakeAsync(inject([HttpService, PoolMarginService],
        (http: HttpAsyncServiceStub<PoolMarginServerData[]>, service: PoolMarginService) => {
            // Generate test data
            http.returnValue(generatePoolMarginLatest());
            // Create component
            page = new PoolMarginSummaryPage(TestBed.createComponent(PoolMarginLatestSummaryComponent));

            //We have to detach the timer and reatach it later in test to be in correct Zone
            // noinspection JSDeprecatedSymbols
            service.destroyPeriodicTimer();
        })));

    it('displays error correctly', fakeAsync(inject([HttpService, PoolMarginService],
        (http: HttpAsyncServiceStub<PoolMarginServerData[]>, service: PoolMarginService) => {
            // Attach the timer
            service.setupPeriodicTimer();

            // Init component
            page.detectChanges();

            expect(page.panels.length).toBe(0, 'Nothing shown');

            // Return error
            http.throwError({
                status   : 500,
                message  : 'Error message',
                errorType: ErrorType.REQUEST
            });
            page.advanceHTTP();

            expect(page.panels.length).toBe(4, 'Nothing shown');
            page.panels.forEach((panel: Panel, index: number) => {
                expect(panel.value).toBe('0', 'No data');
                expect(panel.title).toBe(labels[index]);
                expect(panel.green).toBeTruthy('Is green');
                expect(panel.red).toBeFalsy('Is not red');
            });

            // Discard the service timer
            // noinspection JSDeprecatedSymbols
            service.destroyPeriodicTimer();
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService, PoolMarginService],
        (http: HttpAsyncServiceStub<PoolMarginServerData[]>, service: PoolMarginService) => {
            // Attach the timer
            service.setupPeriodicTimer();

            // Init component
            page.detectChanges();

            expect(page.panels.length).toBe(0, 'Nothing shown');

            // Return no data
            http.popReturnValue(); // Remove from queue
            http.returnValue([]); // Push empty array
            page.advanceHTTP();

            expect(page.panels.length).toBe(4, 'Nothing shown');
            page.panels.forEach((panel: Panel, index: number) => {
                expect(panel.value).toBe('0', 'No data');
                expect(panel.title).toBe(labels[index]);
                expect(panel.green).toBeTruthy('Is green');
                expect(panel.red).toBeFalsy('Is not red');
            });

            // Discard the service timer
            // noinspection JSDeprecatedSymbols
            service.destroyPeriodicTimer();
        })));

    it('displays data panels', fakeAsync(inject([PoolMarginService],
        (service: PoolMarginService) => {
            // Attach the timer
            service.setupPeriodicTimer();

            // Init component
            page.detectChanges();

            expect(page.panels.length).toBe(0, 'Nothing shown');

            // Return data
            page.advanceHTTP();

            let values = ['3', '0', '73', '-9'];

            expect(page.panels.length).toBe(4, 'Nothing shown');
            page.panels.forEach((panel: Panel, index: number) => {
                expect(panel.value).toBe(values[index]);
                expect(panel.title).toBe(labels[index]);
                if (values[index].charAt(0) === '-') {
                    expect(panel.green).toBeFalsy('Is not green');
                    expect(panel.red).toBeTruthy('Is red');
                } else {
                    expect(panel.green).toBeTruthy('Is green');
                    expect(panel.red).toBeFalsy('Is not red');
                }
            });

            // Discard the service timer
            // noinspection JSDeprecatedSymbols
            service.destroyPeriodicTimer();
        })));
});