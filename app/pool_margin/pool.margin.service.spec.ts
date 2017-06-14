import {inject, TestBed} from '@angular/core/testing';

import {HttpServiceStub} from '@dbg-riskit/DAVe-UI-testing';

import {Request} from '@dbg-riskit/DAVe-UI-common';
import {HttpService} from '@dbg-riskit/DAVe-UI-http';

import {generatePoolMarginLatest} from '../../testing';

import {poolMarginHistoryURL, poolMarginLatestURL, PoolMarginService} from './pool.margin.service';
import {PoolMarginData, PoolMarginServerData, PoolMarginSummaryData} from './pool.margin.types';

import Spy = jasmine.Spy;

describe('PoolMarginService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PoolMarginService,
                {
                    provide : HttpService,
                    useClass: HttpServiceStub
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<PoolMarginServerData[]>) => {
        http.returnValue(generatePoolMarginLatest());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed',
        inject([PoolMarginService, HttpService],
            (poolMarginService: PoolMarginService,
                http: HttpServiceStub<PoolMarginServerData[]>) => {
                poolMarginService.getPoolMarginLatest({}).subscribe(
                    (data: PoolMarginData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(poolMarginLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual({});
                        expect(data.length).toBe(Math.pow(2, 3));
                    });

                http.returnValue(null);
                poolMarginService.getPoolMarginLatest({
                    clearer       : 'a',
                    pool          : 'b',
                    marginCurrency: 'c'
                }).subscribe((data: PoolMarginData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(2);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(poolMarginLatestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                        clearer       : 'a',
                        pool          : 'b',
                        marginCurrency: 'c'
                    });
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });
            })
    );

    it('history data are correctly processed',
        inject([PoolMarginService, HttpService],
            (poolMarginService: PoolMarginService,
                http: HttpServiceStub<PoolMarginServerData[]>) => {
                poolMarginService.getPoolMarginHistory({
                    clearer       : '*',
                    pool          : '*',
                    marginCurrency: '*'
                }).subscribe(
                    (data: PoolMarginData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(poolMarginHistoryURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                            clearer       : '*',
                            pool          : '*',
                            marginCurrency: '*'
                        });
                        expect(data.length).toBe(Math.pow(2, 3));
                    });

                http.returnValue(null);
                poolMarginService.getPoolMarginHistory({
                    clearer       : 'a',
                    pool          : 'b',
                    marginCurrency: 'c'
                }).subscribe((data: PoolMarginData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(2);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(poolMarginHistoryURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                        clearer       : 'a',
                        pool          : 'b',
                        marginCurrency: 'c'
                    });
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });
            })
    );

    it('summary data are correctly processed',
        inject([PoolMarginService, HttpService],
            (poolMarginService: PoolMarginService,
                http: HttpServiceStub<PoolMarginServerData[]>) => {
                let originalData = http.popReturnValue();
                http.returnValue(originalData);
                poolMarginService.getPoolMarginSummaryData().subscribe(
                    (data: PoolMarginSummaryData) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(poolMarginLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .not.toBeDefined();

                        let aggregatedData: PoolMarginSummaryData = {
                            shortfallSurplus : 0,
                            marginRequirement: 0,
                            totalCollateral  : 0,
                            cashBalance      : 0
                        };

                        originalData.forEach((record: PoolMarginServerData) => {
                            aggregatedData.shortfallSurplus += record.overUnderInMarginCurr;
                            aggregatedData.marginRequirement += record.requiredMargin;
                            aggregatedData.totalCollateral += record.cashCollateralAmount + record.adjustedSecurities
                                + record.adjustedGuarantee + record.variPremInMarginCurr;
                            aggregatedData.cashBalance += record.cashCollateralAmount + record.variPremInMarginCurr;
                        });

                        expect(data).toEqual(aggregatedData);
                    });

                http.returnValue(null);
                poolMarginService.getPoolMarginSummaryData()
                    .subscribe((data: PoolMarginSummaryData) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(poolMarginLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .not.toBeDefined();
                        expect(data).toBeDefined();
                        expect(data.shortfallSurplus).not.toBeDefined();
                        expect(data.marginRequirement).not.toBeDefined();
                        expect(data.totalCollateral).not.toBeDefined();
                        expect(data.cashBalance).not.toBeDefined();
                    });
            })
    );
});