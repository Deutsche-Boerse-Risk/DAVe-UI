import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {HttpServiceStub} from '@dbg-riskit/dave-ui-testing';

import {Request} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generateRiskLimitUtilization} from '@dave/testing';

import {
    riskLimitUtilizationHistoryURL,
    riskLimitUtilizationLatestURL,
    RiskLimitUtilizationService
} from './risk.limit.utilization.service';
import {RiskLimitUtilizationData, RiskLimitUtilizationServerData} from './risk.limit.utilization.types';

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
                PeriodicHttpService
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
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                        .toEqual({});
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
            let subscription2 = riskLimitUtilizationService.getRiskLimitUtilizationLatest({
                clearer   : 'a',
                member    : 'b',
                maintainer: 'c',
                limitType : 'd'
            })
                .subscribe((data: RiskLimitUtilizationData[]) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(riskLimitUtilizationLatestURL);
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

    it('history data are correctly processed', fakeAsync(inject([RiskLimitUtilizationService, HttpService],
        (riskLimitUtilizationService: RiskLimitUtilizationService,
            http: HttpServiceStub<RiskLimitUtilizationServerData[]>) => {
            let subscription = riskLimitUtilizationService.getRiskLimitUtilizationHistory({
                clearer   : '*',
                member    : '*',
                maintainer: '*',
                limitType : '*'
            })
                .subscribe((data: RiskLimitUtilizationData[]) => {
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
            })
                .subscribe((data: RiskLimitUtilizationData[]) => {
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