import {TestBed, inject} from '@angular/core/testing';

import {HttpServiceStub, generateTotalMargin} from '../../testing';
import Spy = jasmine.Spy;

import {HttpService, Request} from '../http.service';

import {TotalMarginService, totalMarginLatestURL, totalMarginHistoryURL} from './total.margin.service';
import {TotalMarginServerData, TotalMarginData} from './total.margin.types';

describe('TotalMarginService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TotalMarginService,
                {
                    provide: HttpService, useClass: HttpServiceStub
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<TotalMarginServerData[]>) => {
        http.returnValue(generateTotalMargin());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed',
        inject([TotalMarginService, HttpService],
            (TotalMarginService: TotalMarginService,
             http: HttpServiceStub<TotalMarginServerData[]>) => {
                TotalMarginService.getTotalMarginLatest()
                    .subscribe((data: TotalMarginData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(totalMarginLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['*', '*', '*', '*', '*']);
                        expect(data.length).toBe(Math.pow(3, 5));
                    });

                http.returnValue(null);
                TotalMarginService.getTotalMarginLatest('a', 'b', 'c', 'd', 'e')
                    .subscribe((data: TotalMarginData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(totalMarginLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['a', 'b', 'c', 'd', 'e']);
                        expect(data).toBeDefined();
                        expect(data.length).toBe(0);
                    });
            })
    );

    it('history data are correctly processed',
        inject([TotalMarginService, HttpService],
            (TotalMarginService: TotalMarginService,
             http: HttpServiceStub<TotalMarginServerData[]>) => {
                TotalMarginService.getTotalMarginHistory('*', '*', '*', '*', '*')
                    .subscribe((data: TotalMarginData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(totalMarginHistoryURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['*', '*', '*', '*', '*']);
                        expect(data.length).toBe(Math.pow(3, 5));
                    });

                http.returnValue(null);
                TotalMarginService.getTotalMarginHistory('a', 'b', 'c', 'd', 'e')
                    .subscribe((data: TotalMarginData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(totalMarginHistoryURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['a', 'b', 'c', 'd', 'e']);
                        expect(data).toBeDefined();
                        expect(data.length).toBe(0);
                    });
            })
    );
});