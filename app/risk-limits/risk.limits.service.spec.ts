import {TestBed, inject} from '@angular/core/testing';

import {HttpServiceStub, generateRiskLimits} from '../../testing';
import Spy = jasmine.Spy;

import {HttpService, Request} from '../http.service';

import {RiskLimitsService, riskLimitsLatestURL, riskLimitsHistoryURL} from './risk.limits.service';
import {RiskLimitsServerData, RiskLimitsData} from './risk.limits.types';

describe('RiskLimitsService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RiskLimitsService,
                {
                    provide: HttpService, useClass: HttpServiceStub
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<RiskLimitsServerData[]>) => {
        http.returnValue(generateRiskLimits());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed',
        inject([RiskLimitsService, HttpService],
            (RiskLimitsService: RiskLimitsService,
             http: HttpServiceStub<RiskLimitsServerData[]>) => {
                RiskLimitsService.getRiskLimitsLatest()
                    .subscribe((data: RiskLimitsData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(riskLimitsLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['*', '*', '*', '*']);
                        expect(data.length).toBe(Math.pow(3, 4));
                        data.forEach((row: RiskLimitsData) => {
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
                RiskLimitsService.getRiskLimitsLatest('a', 'b', 'c', 'd')
                    .subscribe((data: RiskLimitsData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(riskLimitsLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['a', 'b', 'c', 'd']);
                        expect(data).toBeDefined();
                        expect(data.length).toBe(0);
                    });
            })
    );

    it('history data are correctly processed',
        inject([RiskLimitsService, HttpService],
            (RiskLimitsService: RiskLimitsService,
             http: HttpServiceStub<RiskLimitsServerData[]>) => {
                RiskLimitsService.getRiskLimitsHistory('*', '*', '*', '*')
                    .subscribe((data: RiskLimitsData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(riskLimitsHistoryURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['*', '*', '*', '*']);
                        expect(data.length).toBe(Math.pow(3, 4));
                        data.forEach((row: RiskLimitsData) => {
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
                RiskLimitsService.getRiskLimitsHistory('a', 'b', 'c', 'd')
                    .subscribe((data: RiskLimitsData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(riskLimitsHistoryURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['a', 'b', 'c', 'd']);
                        expect(data).toBeDefined();
                        expect(data.length).toBe(0);
                    });
            })
    );
});