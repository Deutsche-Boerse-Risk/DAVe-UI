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
                    provide : HttpService,
                    useClass: HttpServiceStub
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
            positionReportsService.getPositionReportLatest({}).subscribe((data: PositionReportData[]) => {
                expect(httpSyp).toHaveBeenCalledTimes(1);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(latestURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({});
                expect(data.length).toBe(Math.pow(2, 10));
            });

            http.returnValue(null);
            positionReportsService.getPositionReportLatest({
                clearer              : 'a',
                member               : 'b',
                account              : 'c',
                liquidationGroup     : 'd',
                liquidationGroupSplit: 'e',
                product              : 'f',
                callPut              : 'g',
                contractYear         : 'h',
                contractMonth        : 'i',
                expiryDay            : 'j',
                exercisePrice        : 'k',
                version              : 'l',
                flexContractSymbol   : 'm'
            }).subscribe((data: PositionReportData[]) => {
                expect(httpSyp).toHaveBeenCalledTimes(2);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(latestURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                    clearer              : 'a',
                    member               : 'b',
                    account              : 'c',
                    liquidationGroup     : 'd',
                    liquidationGroupSplit: 'e',
                    product              : 'f',
                    callPut              : 'g',
                    contractYear         : 'h',
                    contractMonth        : 'i',
                    expiryDay            : 'j',
                    exercisePrice        : 'k',
                    version              : 'l',
                    flexContractSymbol   : 'm'
                });
                expect(data).toBeDefined();
                expect(data.length).toBe(0);
            });
        })
    );

    it('history data are correctly processed',
        inject([PositionReportsService, HttpService], (positionReportsService: PositionReportsService,
            http: HttpServiceStub<PositionReportServerData[]>) => {
            positionReportsService.getPositionReportHistory({
                clearer              : '*',
                member               : '*',
                account              : '*',
                liquidationGroup     : '*',
                liquidationGroupSplit: '*',
                product              : '*',
                callPut              : '*',
                contractYear         : '*',
                contractMonth        : '*',
                expiryDay            : '*',
                exercisePrice        : '*',
                version              : '*',
                flexContractSymbol   : '*'
            }).subscribe((data: PositionReportData[]) => {
                expect(httpSyp).toHaveBeenCalledTimes(1);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(historyURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                    clearer              : '*',
                    member               : '*',
                    account              : '*',
                    liquidationGroup     : '*',
                    liquidationGroupSplit: '*',
                    product              : '*',
                    callPut              : '*',
                    contractYear         : '*',
                    contractMonth        : '*',
                    expiryDay            : '*',
                    exercisePrice        : '*',
                    version              : '*',
                    flexContractSymbol   : '*'
                });
                expect(data.length).toBe(Math.pow(2, 10));
            });

            http.returnValue(null);
            positionReportsService.getPositionReportHistory({
                clearer              : 'a',
                member               : 'b',
                account              : 'c',
                liquidationGroup     : 'd',
                liquidationGroupSplit: 'e',
                product              : 'f',
                callPut              : 'g',
                contractYear         : 'h',
                contractMonth        : 'i',
                expiryDay            : 'j',
                exercisePrice        : 'k',
                version              : 'l',
                flexContractSymbol   : 'm'
            }).subscribe((data: PositionReportData[]) => {
                expect(httpSyp).toHaveBeenCalledTimes(2);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(historyURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                    clearer              : 'a',
                    member               : 'b',
                    account              : 'c',
                    liquidationGroup     : 'd',
                    liquidationGroupSplit: 'e',
                    product              : 'f',
                    callPut              : 'g',
                    contractYear         : 'h',
                    contractMonth        : 'i',
                    expiryDay            : 'j',
                    exercisePrice        : 'k',
                    version              : 'l',
                    flexContractSymbol   : 'm'
                });
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
                    expect(data.bubbles.length).toBe(Math.pow(2, 6));

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
            let expectSelectItems = function (data: PositionReportChartData, clearer: string, member: string,
                account: string) {
                expect(data.selection.get(clearer + '-' + member).subRecords).toBeDefined();
                expect(data.selection.get(clearer + '-' + member).subRecords.getOptions()).toBeDefined();
                expect(data.selection.get(clearer + '-' + member).subRecords.getOptions().length).toBe(2);
                expect(data.selection.get(clearer + '-' + member).subRecords.get(account)).toBeDefined();
                expect(data.selection.get(clearer + '-' + member).subRecords.get(account).record.clearer).toBe(clearer);
                expect(data.selection.get(clearer + '-' + member).subRecords.get(account).record.member).toBe(member);
                expect(data.selection.get(clearer + '-' + member).subRecords.get(account).record.account).toBe(account);
            };
            positionReportsService.getPositionReportsChartData()
                .subscribe((data: PositionReportChartData) => {
                    expect(httpSyp).toHaveBeenCalledTimes(1);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(chartsURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toBeUndefined();

                    expect(data.selection.getOptions()).toBeDefined();
                    expect(data.selection.getOptions().length).toBe(2);
                    expectSelectItems(data, 'B', 'F', 'I');
                    expectSelectItems(data, 'D', 'G', 'I');
                    expectSelectItems(data, 'D', 'G', 'J');

                    expect(data.memberSelection.clearer).toBe('B');
                    expect(data.memberSelection.member).toBe('F');
                    expect(data.memberSelection.account).toBe('I');
                    expect(data.accountSelection.clearer).toBe('B');
                    expect(data.accountSelection.member).toBe('F');
                    expect(data.accountSelection.account).toBe('I');
                });
        })
    );
});