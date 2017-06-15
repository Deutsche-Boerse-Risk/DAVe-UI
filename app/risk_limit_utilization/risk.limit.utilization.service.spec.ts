import {TestBed, inject} from '@angular/core/testing';

import {HttpServiceStub, generateRiskLimitUtilization} from '../../testing';
import Spy = jasmine.Spy;

import {HttpService, Request} from '../http.service';

import {
    RiskLimitUtilizationService,
    riskLimitUtilizationLatestURL,
    riskLimitUtilizationHistoryURL
} from './risk.limit.utilization.service';
import {RiskLimitUtilizationServerData, RiskLimitUtilizationData} from './risk.limit.utilization.types';

describe('RiskLimitUtilizationService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RiskLimitUtilizationService,
                {
                    provide : HttpService,
                    useClass: HttpServiceStub
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<RiskLimitUtilizationServerData[]>) => {
        http.returnValue(generateRiskLimitUtilization());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed',
        inject([RiskLimitUtilizationService, HttpService],
            (riskLimitUtilizationService: RiskLimitUtilizationService,
                http: HttpServiceStub<RiskLimitUtilizationServerData[]>) => {
                riskLimitUtilizationService.getRiskLimitUtilizationLatest({})
                    .subscribe((data: RiskLimitUtilizationData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
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

                http.returnValue(null);
                riskLimitUtilizationService.getRiskLimitUtilizationLatest({
                    clearer   : 'a',
                    member    : 'b',
                    maintainer: 'c',
                    limitType : 'd'
                })
                    .subscribe((data: RiskLimitUtilizationData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
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
            })
    );

    it('history data are correctly processed',
        inject([RiskLimitUtilizationService, HttpService],
            (riskLimitUtilizationService: RiskLimitUtilizationService,
                http: HttpServiceStub<RiskLimitUtilizationServerData[]>) => {
                riskLimitUtilizationService.getRiskLimitUtilizationHistory({
                    clearer   : '*',
                    member    : '*',
                    maintainer: '*',
                    limitType : '*'
                })
                    .subscribe((data: RiskLimitUtilizationData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
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

                http.returnValue(null);
                riskLimitUtilizationService.getRiskLimitUtilizationHistory({
                    clearer   : 'a',
                    member    : 'b',
                    maintainer: 'c',
                    limitType : 'd'
                })
                    .subscribe((data: RiskLimitUtilizationData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
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
            })
    );
});