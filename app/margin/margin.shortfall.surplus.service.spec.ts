import {TestBed, inject} from "@angular/core/testing";

import {HttpServiceStub, generateShortfallSurplusLatest} from "../../testing";
import Spy = jasmine.Spy;

import {HttpService, Request} from "../http.service";

import {
    MarginShortfallSurplusService, marginShortfallSurplusHistoryURL,
    marginShortfallSurplusLatestURL, marginShortfallSurplusURL
} from "./margin.shortfall.surplus.service";
import {MarginShortfallSurplusData, MarginShortfallSurplusServerData, MarginShortfallSurplusBase} from "./margin.types";

describe('MarginShortfallSurplusService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MarginShortfallSurplusService,
                {
                    provide: HttpService, useClass: HttpServiceStub
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<MarginShortfallSurplusServerData[]>) => {
        http.returnValue(generateShortfallSurplusLatest());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed',
        inject([MarginShortfallSurplusService, HttpService],
            (marginShortfallSurplusService: MarginShortfallSurplusService,
             http: HttpServiceStub<MarginShortfallSurplusServerData[]>) => {
                marginShortfallSurplusService.getShortfallSurplusLatest().subscribe(
                    (data: MarginShortfallSurplusData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginShortfallSurplusLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['*', '*', '*', '*']);
                        expect(data.length).toBe(Math.pow(3, 4));
                    });

                http.returnValue(null);
                marginShortfallSurplusService.getShortfallSurplusLatest('a', 'b', 'c', 'd')
                    .subscribe((data: MarginShortfallSurplusData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginShortfallSurplusLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['a', 'b', 'c', 'd']);
                        expect(data).toBeDefined();
                        expect(data.length).toBe(0);
                    });
            })
    );

    it('history data are correctly processed',
        inject([MarginShortfallSurplusService, HttpService],
            (marginShortfallSurplusService: MarginShortfallSurplusService,
             http: HttpServiceStub<MarginShortfallSurplusServerData[]>) => {
                marginShortfallSurplusService.getShortfallSurplusHistory('*', '*', '*', '*', '*').subscribe(
                    (data: MarginShortfallSurplusData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginShortfallSurplusHistoryURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['*', '*', '*', '*', '*']);
                        expect(data.length).toBe(Math.pow(3, 4));
                    });

                http.returnValue(null);
                marginShortfallSurplusService.getShortfallSurplusHistory('a', 'b', 'c', 'd', 'e')
                    .subscribe((data: MarginShortfallSurplusData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginShortfallSurplusHistoryURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['a', 'b', 'c', 'd', 'e']);
                        expect(data).toBeDefined();
                        expect(data.length).toBe(0);
                    });
            })
    );

    it('history data are correctly processed',
        inject([MarginShortfallSurplusService, HttpService],
            (marginShortfallSurplusService: MarginShortfallSurplusService,
             http: HttpServiceStub<MarginShortfallSurplusServerData[]>) => {
                let originalData = http.popReturnValue();
                http.returnValue(originalData);
                marginShortfallSurplusService.getMarginShortfallSurplusData().subscribe(
                    (data: MarginShortfallSurplusBase) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginShortfallSurplusURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .not.toBeDefined();

                        let aggregatedData: MarginShortfallSurplusBase = {
                            uid: null,
                            shortfallSurplus: 0,
                            marginRequirement: 0,
                            securityCollateral: 0,
                            cashBalance: 0,
                            marginCall: 0,
                        };

                        originalData.forEach((record: MarginShortfallSurplusServerData) => {
                            aggregatedData.shortfallSurplus += record.shortfallSurplus;
                            aggregatedData.marginRequirement += record.marginRequirement;
                            aggregatedData.securityCollateral += record.securityCollateral;
                            aggregatedData.cashBalance += record.cashBalance;
                            aggregatedData.marginCall += record.marginCall;
                        });

                        expect(data.shortfallSurplus).toBe(aggregatedData.shortfallSurplus);
                        expect(data.marginRequirement).toBe(aggregatedData.marginRequirement);
                        expect(data.securityCollateral).toBe(aggregatedData.securityCollateral);
                        expect(data.cashBalance).toBe(aggregatedData.cashBalance);
                        expect(data.marginCall).toBe(aggregatedData.marginCall);
                    });

                http.returnValue(null);
                marginShortfallSurplusService.getMarginShortfallSurplusData()
                    .subscribe((data: MarginShortfallSurplusBase) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginShortfallSurplusURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .not.toBeDefined();
                        expect(data).toBeDefined();
                        expect(data.shortfallSurplus).not.toBeDefined();
                        expect(data.marginRequirement).not.toBeDefined();
                        expect(data.securityCollateral).not.toBeDefined();
                        expect(data.cashBalance).not.toBeDefined();
                        expect(data.marginCall).not.toBeDefined();
                    });
            })
    );
});