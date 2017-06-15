import {BrowserModule} from '@angular/platform-browser';

import {async, TestBed, fakeAsync, inject} from '@angular/core/testing';

import {
    PoolMarginSummaryPage,
    Panel,
    HttpAsyncServiceStub,
    generatePoolMarginLatest
} from '../../testing';

import {PoolMarginServerData} from './pool.margin.types';
import {PoolMarginService} from './pool.margin.service';
import {HttpService} from '../http.service';

import {PoolMarginLatestSummaryComponent} from './pool.margin.latest.summary.component';

describe('Pool Margin summary', () => {
    let page: PoolMarginSummaryPage;

    let labels = ['Margin Shortfall/Surplus', 'Margin Requirement', 'Collateral', 'Cash Balance'];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports     : [
                BrowserModule
            ],
            declarations: [
                PoolMarginLatestSummaryComponent
            ],
            providers   : [
                PoolMarginService,
                {
                    provide : HttpService,
                    useClass: HttpAsyncServiceStub
                }
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<PoolMarginServerData[]>) => {
        // Generate test data
        http.returnValue(generatePoolMarginLatest());
        // Create component
        page = new PoolMarginSummaryPage(TestBed.createComponent(PoolMarginLatestSummaryComponent));
    })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<PoolMarginServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.panels.length).toBe(0, 'Nothing shown');

            // Return error
            http.throwError({
                status : 500,
                message: 'Error message'
            });
            page.advanceHTTP();

            expect(page.panels.length).toBe(0, 'Nothing shown');
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<PoolMarginServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.panels.length).toBe(0, 'Nothing shown');

            // Return no data
            http.popReturnValue(); // Remove from queue
            http.returnValue([]); // Push empty array
            page.advanceHTTP();

            expect(page.panels.length).toBe(4, 'Nothing shown');
            page.panels.forEach((panel: Panel, index: number) => {
                expect(panel.value).toBe('0.00', 'No data');
                expect(panel.title).toBe(labels[index]);
                expect(panel.green).toBeTruthy('Is green');
                expect(panel.red).toBeFalsy('Is not red');
            });
        })));

    it('displays data panels', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);

        expect(page.panels.length).toBe(0, 'Nothing shown');

        // Return data
        page.advanceHTTP();

        let values = ['2.96', '0.49', '73.45', '-8.67'];

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
    }));
});