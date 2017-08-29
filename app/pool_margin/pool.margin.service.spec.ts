import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {AuthServiceStub, HttpServiceStub} from '@dbg-riskit/dave-ui-testing';

import {AUTH_PROVIDER, Request, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';
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
                PeriodicHttpService,
                ErrorCollectorService,
                {
                    provide : AUTH_PROVIDER,
                    useClass: AuthServiceStub
                }
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
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toBeUndefined();
                    expect(data.length).toBe(Math.pow(2, 3));
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue([
                {
                    clearer       : 'a',
                    pool          : 'b',
                    marginCurrency: 'c'
                },
                {
                    clearer       : 'aa',
                    pool          : 'b',
                    marginCurrency: 'c'
                },
                {
                    clearer       : 'a',
                    pool          : 'ba',
                    marginCurrency: 'c'
                },
                {
                    clearer       : 'a',
                    pool          : 'b',
                    marginCurrency: 'ca'
                }
            ] as PoolMarginServerData[]);
            tick(DATA_REFRESH_INTERVAL);

            let subscription2 = poolMarginService.getPoolMarginLatest({
                clearer       : 'a',
                pool          : 'b',
                marginCurrency: 'c'
            }).subscribe((data: PoolMarginData[]) => {
                expect(data).toBeDefined();
                expect(data.length).toBe(1);
                expect(data[0].uid).toEqual(UIDUtils.computeUID('a', 'b', 'c', null));
            });

            expect(httpSyp).toHaveBeenCalledTimes(2);
            subscription2.unsubscribe();

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);

            let subscription3 = poolMarginService.getPoolMarginLatest({})
                .subscribe((data: PoolMarginData[]) => {
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(4);
            subscription3.unsubscribe();

            // Cleanup timer after test
            //noinspection JSDeprecatedSymbols
            poolMarginService.destroyPeriodicTimer();
        })
    ));

    it('history data are correctly processed', fakeAsync(inject([PoolMarginService, HttpService],
        (poolMarginService: PoolMarginService,
            http: HttpServiceStub<PoolMarginServerData[]>) => {

            // Cleanup timer for latest data as we are going to test history records only
            //noinspection JSDeprecatedSymbols
            poolMarginService.destroyPeriodicTimer();

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
                (pools: PoolMarginSummaryData[]) => {
                    pools.forEach((data: PoolMarginSummaryData) => {
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(poolMarginLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .not.toBeDefined();

                        let aggregatedData: PoolMarginSummaryData = {
                            pool             : data.pool,
                            shortfallSurplus : 0,
                            marginRequirement: 0,
                            totalCollateral  : 0,
                            cashBalance      : 0,
                            ccy              : data.ccy
                        };

                        originalData.forEach((record: PoolMarginServerData) => {
                            if (record.pool === aggregatedData.pool) {
                                aggregatedData.shortfallSurplus += record.overUnderInClrRptCurr;
                                aggregatedData.marginRequirement += record.requiredMargin * record.adjustedExchangeRate;
                                aggregatedData.totalCollateral += (record.cashCollateralAmount + record.adjustedSecurities) * record.adjustedExchangeRate;
                                aggregatedData.cashBalance += record.cashCollateralAmount * record.adjustedExchangeRate;
                            }
                        });

                        expect(data).toEqual(aggregatedData);
                    });
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);

            let subscription2 = poolMarginService.getPoolMarginSummaryData()
                .subscribe((pools: PoolMarginSummaryData[]) => {
                    pools.forEach((data: PoolMarginSummaryData) => {
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(poolMarginLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .not.toBeDefined();
                        expect(data).toBeDefined();
                        expect(data.shortfallSurplus).toBe(0);
                        expect(data.marginRequirement).toBe(0);
                        expect(data.totalCollateral).toBe(0);
                        expect(data.cashBalance).toBe(0);
                    });
                });

            expect(httpSyp).toHaveBeenCalledTimes(2);

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);
            subscription2.unsubscribe();

            // Cleanup timer after test
            //noinspection JSDeprecatedSymbols
            poolMarginService.destroyPeriodicTimer();
        })
    ));
});