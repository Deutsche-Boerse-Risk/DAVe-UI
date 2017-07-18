import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {HttpServiceStub} from '@dbg-riskit/dave-ui-testing';

import {Request} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generatePoolMarginLatest} from '@dave/testing';

import {poolMarginHistoryURL, poolMarginLatestURL, PoolMarginService} from './pool.margin.service';
import {PoolMarginData, PoolMarginServerData, PoolMarginSummaryData} from './pool.margin.types';

import {DATA_REFRESH_INTERVAL, PeriodicHttpService} from '../periodic.http.service';

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
                },
                PeriodicHttpService
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<PoolMarginServerData[]>) => {
        http.returnValue(generatePoolMarginLatest());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed', fakeAsync(inject([PoolMarginService, HttpService],
        (poolMarginService: PoolMarginService,
            http: HttpServiceStub<PoolMarginServerData[]>) => {
            let subscription = poolMarginService.getPoolMarginLatest({}).subscribe(
                (data: PoolMarginData[]) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(poolMarginLatestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                        .toEqual({});
                    expect(data.length).toBe(Math.pow(2, 3));
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            let subscription2 = poolMarginService.getPoolMarginLatest({
                clearer       : 'a',
                pool          : 'b',
                marginCurrency: 'c'
            }).subscribe((data: PoolMarginData[]) => {
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

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(2);

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);
            subscription2.unsubscribe();
        })
    ));

    it('history data are correctly processed', fakeAsync(inject([PoolMarginService, HttpService],
        (poolMarginService: PoolMarginService,
            http: HttpServiceStub<PoolMarginServerData[]>) => {
            let subscription = poolMarginService.getPoolMarginHistory({
                clearer       : '*',
                pool          : '*',
                marginCurrency: '*'
            }).subscribe(
                (data: PoolMarginData[]) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(poolMarginHistoryURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                        clearer       : '*',
                        pool          : '*',
                        marginCurrency: '*'
                    });
                    expect(data.length).toBe(Math.pow(2, 3));
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            let subscription2 = poolMarginService.getPoolMarginHistory({
                clearer       : 'a',
                pool          : 'b',
                marginCurrency: 'c'
            }).subscribe((data: PoolMarginData[]) => {
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(poolMarginHistoryURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                    clearer       : 'a',
                    pool          : 'b',
                    marginCurrency: 'c'
                });
                expect(data).toBeDefined();
                expect(data.length).toBe(0);
            });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(2);

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);
            subscription2.unsubscribe();
        })
    ));

    it('summary data are correctly processed', fakeAsync(inject([PoolMarginService, HttpService],
        (poolMarginService: PoolMarginService,
            http: HttpServiceStub<PoolMarginServerData[]>) => {
            let originalData = http.popReturnValue();
            http.returnValue(originalData);
            let subscription = poolMarginService.getPoolMarginSummaryData().subscribe(
                (data: PoolMarginSummaryData) => {
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

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            let subscription2 = poolMarginService.getPoolMarginSummaryData()
                .subscribe((data: PoolMarginSummaryData) => {
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

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(2);

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);
            subscription2.unsubscribe();
        })
    ));
});