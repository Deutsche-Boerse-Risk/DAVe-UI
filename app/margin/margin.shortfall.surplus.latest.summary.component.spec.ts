import {BrowserModule} from '@angular/platform-browser';

import {async, TestBed, fakeAsync, inject} from '@angular/core/testing';

import {
    ShortfallSurplusSummaryPage,
    Panel,
    HttpAsyncServiceStub,
    generateShortfallSurplusLatest
} from '../../testing';

import {MarginShortfallSurplusServerData} from './margin.types';
import {MarginShortfallSurplusService} from './margin.shortfall.surplus.service';
import {HttpService} from '../http.service';

import {MarginShortfallSurplusLatestSummaryComponent} from './margin.shortfall.surplus.latest.summary.component';

describe('Margin shortfall-surplus summary', () => {
    let page: ShortfallSurplusSummaryPage;

    let labels = ['Margin Shortfall/Surplus', 'Margin Requirement', 'Collateral', 'Cash Balance'];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule
            ],
            declarations: [
                MarginShortfallSurplusLatestSummaryComponent
            ],
            providers: [
                MarginShortfallSurplusService,
                {
                    provide: HttpService, useClass: HttpAsyncServiceStub
                }
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<MarginShortfallSurplusServerData[]>) => {
        // Generate test data
        http.returnValue(generateShortfallSurplusLatest());
        // Create component
        page = new ShortfallSurplusSummaryPage(TestBed.createComponent(MarginShortfallSurplusLatestSummaryComponent));
    })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<MarginShortfallSurplusServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.panels.length).toBe(0, 'Nothing shown');

            // Return error
            http.throwError({
                status: 500,
                message: 'Error message'
            });
            page.advanceHTTP();

            expect(page.panels.length).toBe(0, 'Nothing shown');
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<MarginShortfallSurplusServerData[]>) => {
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

    it('displays data table', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);

        expect(page.panels.length).toBe(0, 'Nothing shown');

        // Return data
        page.advanceHTTP();

        let values = ['742.50', '5.08', '-23.46', '326.63'];

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