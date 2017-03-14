import {TestBed, inject} from '@angular/core/testing';

import {HttpServiceStub, generatePositionReports} from '../../testing';
import Spy = jasmine.Spy;

import {HttpService, Request} from '../http.service';

import {PositionReportsService, historyURL, latestURL, chartsURL} from './position.reports.service';
import {
    PositionReportServerData, PositionReportData, PositionReportChartData,
    PositionReportBubble
} from './position.report.types';

describe('PositionReportsService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PositionReportsService,
                {
                    provide: HttpService, useClass: HttpServiceStub
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<PositionReportServerData[]>) => {
        http.returnValue(generatePositionReports());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed',
        inject([PositionReportsService, HttpService], (positionReportsService: PositionReportsService,
                                                       http: HttpServiceStub<PositionReportServerData[]>) => {
            positionReportsService.getPositionReportLatest().subscribe((data: PositionReportData[]) => {
                expect(httpSyp).toHaveBeenCalledTimes(1);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(latestURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual(['*', '*', '*', '*', '*',
                    '*', '*', '*', '*']);
                expect(data.length).toBe(Math.pow(3, 7));
                data.forEach((val: PositionReportData) => {
                    expect(val.strikePrice).toBeDefined();
                    expect(typeof val.strikePrice).toBe('number');
                    expect(val.netLS).toBe(val.crossMarginLongQty - val.crossMarginShortQty);
                    expect(val.netEA).toBe((val.optionExcerciseQty - val.optionAssignmentQty)
                        + (val.allocationTradeQty - val.deliveryNoticeQty));
                })
            });

            http.returnValue(null);
            positionReportsService.getPositionReportLatest('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i')
                .subscribe((data: PositionReportData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(2);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(latestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual(['a', 'b', 'c', 'd', 'e',
                        'f', 'g', 'h', 'i']);
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });
        })
    );

    it('history data are correctly processed',
        inject([PositionReportsService, HttpService], (positionReportsService: PositionReportsService,
                                                       http: HttpServiceStub<PositionReportServerData[]>) => {
            positionReportsService.getPositionReportHistory('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i')
                .subscribe((data: PositionReportData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(1);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(historyURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual(['a', 'b', 'c', 'd', 'e',
                        'f', 'g', 'h', 'i']);
                    expect(data.length).toBe(Math.pow(3, 7));
                    data.forEach((val: PositionReportData) => {
                        expect(val.strikePrice).not.toBeDefined();
                        expect(val.netLS).toBe(val.crossMarginLongQty - val.crossMarginShortQty);
                        expect(val.netEA).toBe((val.optionExcerciseQty - val.optionAssignmentQty)
                            + (val.allocationTradeQty - val.deliveryNoticeQty));
                    })
                });

            http.returnValue(null);
            positionReportsService.getPositionReportHistory('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i')
                .subscribe((data: PositionReportData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(2);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(historyURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual(['a', 'b', 'c', 'd', 'e',
                        'f', 'g', 'h', 'i']);
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });
        })
    );

    it('chart data are aggregeted',
        inject([PositionReportsService, HttpService], (positionReportsService: PositionReportsService,
                                                       http: HttpServiceStub<PositionReportServerData[]>) => {
            let rawData = http.popReturnValue();
            http.returnValue(rawData);
            positionReportsService.getPositionReportsChartData()
                .subscribe((data: PositionReportChartData) => {
                    expect(httpSyp).toHaveBeenCalledTimes(1);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(chartsURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toBeUndefined();

                    expect(data.bubbles).toBeDefined();
                    expect(data.bubbles.length).toBe(Math.pow(3, 4));

                    let originalRadius = 0;
                    rawData.forEach((row: PositionReportServerData) => {
                        originalRadius += row.compVar;
                    });

                    let bubbleRadius = 0;
                    data.bubbles.forEach((row: PositionReportBubble) => {
                        bubbleRadius += row.radius;
                    });

                    expect(bubbleRadius).toBe(originalRadius);
                });
        })
    );

    it('chart data contain select items',
        inject([PositionReportsService], (positionReportsService: PositionReportsService) => {
            let expectSelectItems = function (data: PositionReportChartData, member: string,
                                              account: string) {
                expect(data.selection.get(member + '-' + member).subRecords).toBeDefined();
                expect(data.selection.get(member + '-' + member).subRecords.getOptions()).toBeDefined();
                expect(data.selection.get(member + '-' + member).subRecords.getOptions().length).toBe(3);
                expect(data.selection.get(member + '-' + member).subRecords.get(account)).toBeDefined();
                expect(data.selection.get(member + '-' + member).subRecords.get(account).record.clearer).toBe(member);
                expect(data.selection.get(member + '-' + member).subRecords.get(account).record.member).toBe(member);
                expect(data.selection.get(member + '-' + member).subRecords.get(account).record.account).toBe(account);
            };
            positionReportsService.getPositionReportsChartData()
                .subscribe((data: PositionReportChartData) => {
                    expect(httpSyp).toHaveBeenCalledTimes(1);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(chartsURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toBeUndefined();

                    expect(data.selection.getOptions()).toBeDefined();
                    expect(data.selection.getOptions().length).toBe(3);
                    expectSelectItems(data, 'A', 'B');
                    expectSelectItems(data, 'B', 'A');
                    expectSelectItems(data, 'B', 'C');
                    expectSelectItems(data, 'C', 'A');
                    expectSelectItems(data, 'C', 'B');

                    expect(data.memberSelection.clearer).toBe('A');
                    expect(data.memberSelection.member).toBe('A');
                    expect(data.memberSelection.account).toBe('A');
                    expect(data.accountSelection.clearer).toBe('A');
                    expect(data.accountSelection.member).toBe('A');
                    expect(data.accountSelection.account).toBe('A');
                });
        })
    );
});