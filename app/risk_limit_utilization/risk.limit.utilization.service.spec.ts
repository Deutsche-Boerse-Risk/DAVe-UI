import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {AuthServiceStub, HttpServiceStub} from '@dbg-riskit/dave-ui-testing';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {Request, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generateRiskLimitUtilization} from '@dave/testing';

import {
    riskLimitUtilizationHistoryURL,
    riskLimitUtilizationLatestURL,
    RiskLimitUtilizationService
} from './risk.limit.utilization.service';
import {RiskLimitUtilizationData, RiskLimitUtilizationServerData} from './risk.limit.utilization.types';

import {ErrorCollectorService} from '../error.collector';
import {DATA_REFRESH_INTERVAL, PeriodicHttpService} from '../periodic.http.service';
import Spy = jasmine.Spy;

describe('RiskLimitUtilizationService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RiskLimitUtilizationService,
                {
                    provide : HttpService,
                    useClass: HttpServiceStub
                },
                PeriodicHttpService,
                ErrorCollectorService,
                {
                    provide : AuthService,
                    useClass: AuthServiceStub
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<RiskLimitUtilizationServerData[]>) => {
        http.returnValue(generateRiskLimitUtilization());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed', fakeAsync(inject([RiskLimitUtilizationService, HttpService],
        (riskLimitUtilizationService: RiskLimitUtilizationService,
            http: HttpServiceStub<RiskLimitUtilizationServerData[]>) => {
            let subscription = riskLimitUtilizationService.getRiskLimitUtilizationLatest({})
                .subscribe((data: RiskLimitUtilizationData[]) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(riskLimitUtilizationLatestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toBeUndefined();
                    expect(data.length).toBe(Math.pow(3, 3));
                    data.forEach((row: RiskLimitUtilizationData) => {
                        if (row.warningLevel > 0) {
                            expect(row.warningUtil).toBe(row.utilization / row.warningLevel * 100);
                        } else {
                            expect(row.warningUtil).toBeUndefined();
                        }
                        if (row.throttleLevel > 0) {
                            expect(row.throttleUtil).toBe(row.utilization / row.throttleLevel * 100);
                        } else {
                            expect(row.throttleUtil).toBeUndefined();
                        }
                        if (row.rejectLevel > 0) {
                            expect(row.rejectUtil).toBe(row.utilization / row.rejectLevel * 100);
                        } else {
                            expect(row.rejectUtil).toBeUndefined();
                        }
                    });
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue([
                {
                    clearer   : 'a',
                    member    : 'b',
                    maintainer: 'c',
                    limitType : 'd'
                },
                {
                    clearer   : 'aa',
                    member    : 'b',
                    maintainer: 'c',
                    limitType : 'd'
                },
                {
                    clearer   : 'a',
                    member    : 'ba',
                    maintainer: 'c',
                    limitType : 'd'
                },
                {
                    clearer   : 'a',
                    member    : 'b',
                    maintainer: 'ca',
                    limitType : 'd'
                },
                {
                    clearer   : 'a',
                    member    : 'b',
                    maintainer: 'c',
                    limitType : 'da'
                }
            ] as RiskLimitUtilizationServerData[]);
            tick(DATA_REFRESH_INTERVAL);

            let subscription2 = riskLimitUtilizationService.getRiskLimitUtilizationLatest({
                clearer   : 'a',
                member    : 'b',
                maintainer: 'c',
                limitType : 'd'
            }).subscribe((data: RiskLimitUtilizationData[]) => {
                expect(data).toBeDefined();
                expect(data.length).toBe(1);
                expect(data[0].uid).toEqual(UIDUtils.computeUID('a', 'b', 'c', 'd', null));
            });

            expect(httpSyp).toHaveBeenCalledTimes(2);
            subscription2.unsubscribe();

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);

            let subscription3 = riskLimitUtilizationService.getRiskLimitUtilizationLatest({})
                .subscribe((data: RiskLimitUtilizationData[]) => {
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(4);
            subscription3.unsubscribe();

            // Cleanup timer after test
            //noinspection JSDeprecatedSymbols
            riskLimitUtilizationService.destroyPeriodicTimer();
        })
    ));

    it('history data are correctly processed', fakeAsync(inject([RiskLimitUtilizationService, HttpService],
        (riskLimitUtilizationService: RiskLimitUtilizationService,
            http: HttpServiceStub<RiskLimitUtilizationServerData[]>) => {

            // Cleanup timer for latest data as we are going to test history records only
            //noinspection JSDeprecatedSymbols
            riskLimitUtilizationService.destroyPeriodicTimer();

            let subscription = riskLimitUtilizationService.getRiskLimitUtilizationHistory({
                clearer   : '*',
                member    : '*',
                maintainer: '*',
                limitType : '*'
            }).subscribe((data: RiskLimitUtilizationData[]) => {
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                    .toBe(riskLimitUtilizationHistoryURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                    .toEqual({
                        clearer   : '*',
                        member    : '*',
                        maintainer: '*',
                        limitType : '*'
                    });
                expect(data.length).toBe(Math.pow(3, 3));
                data.forEach((row: RiskLimitUtilizationData) => {
                    if (row.warningLevel > 0) {
                        expect(row.warningUtil).toBe(row.utilization / row.warningLevel * 100);
                    } else {
                        expect(row.warningUtil).toBeUndefined();
                    }
                    if (row.throttleLevel > 0) {
                        expect(row.throttleUtil).toBe(row.utilization / row.throttleLevel * 100);
                    } else {
                        expect(row.throttleUtil).toBeUndefined();
                    }
                    if (row.rejectLevel > 0) {
                        expect(row.rejectUtil).toBe(row.utilization / row.rejectLevel * 100);
                    } else {
                        expect(row.rejectUtil).toBeUndefined();
                    }
                });
            });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            let subscription2 = riskLimitUtilizationService.getRiskLimitUtilizationHistory({
                clearer   : 'a',
                member    : 'b',
                maintainer: 'c',
                limitType : 'd'
            }).subscribe((data: RiskLimitUtilizationData[]) => {
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                    .toBe(riskLimitUtilizationHistoryURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                    .toEqual({
                        clearer   : 'a',
                        member    : 'b',
                        maintainer: 'c',
                        limitType : 'd'
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
});