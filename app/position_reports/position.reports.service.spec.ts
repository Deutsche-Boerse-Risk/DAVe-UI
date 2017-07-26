import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {AuthServiceStub, HttpServiceStub} from '@dbg-riskit/dave-ui-testing';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {Request, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generatePositionReports} from '@dave/testing';

import {historyURL, latestURL, PositionReportsService} from './position.reports.service';
import {
    PositionReportBubble,
    PositionReportChartData,
    PositionReportData,
    PositionReportServerData
} from './position.report.types';

import {DATA_REFRESH_INTERVAL, PeriodicHttpService} from '../periodic.http.service';
import Spy = jasmine.Spy;

describe('PositionReportsService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PositionReportsService,
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

    beforeEach(inject([HttpService], (http: HttpServiceStub<PositionReportServerData[]>) => {
        http.returnValue(generatePositionReports());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed', fakeAsync(inject([PositionReportsService, HttpService],
        (positionReportsService: PositionReportsService,
            http: HttpServiceStub<PositionReportServerData[]>) => {
            let subscription = positionReportsService.getPositionReportLatest({})
                .subscribe((data: PositionReportData[]) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(latestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toBeUndefined();
                    expect(data.length).toBe(Math.pow(2, 10));
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(generatePositionReports());
            tick(DATA_REFRESH_INTERVAL);

            let subscription2 = positionReportsService.getPositionReportLatest({
                clearer   : 'B',
                member    : 'F',
                account   : 'I',
                underlying: 'UIO'
            }).subscribe((data: PositionReportData[]) => {
                expect(data).toBeDefined();
                expect(data.length).toBe(Math.pow(2, 7));
                expect(data[0].uid).toMatch('^' + UIDUtils.computeUID('B', 'F', 'I'));
            });

            expect(httpSyp).toHaveBeenCalledTimes(2);
            subscription2.unsubscribe();

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);

            let subscription3 = positionReportsService.getPositionReportLatest({})
                .subscribe((data: PositionReportData[]) => {
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(4);
            subscription3.unsubscribe();

            // Cleanup timer after test
            //noinspection JSDeprecatedSymbols
            positionReportsService.destroyPeriodicTimer();
        })
    ));

    it('history data are correctly processed', fakeAsync(inject([PositionReportsService, HttpService],
        (positionReportsService: PositionReportsService,
            http: HttpServiceStub<PositionReportServerData[]>) => {

            // Cleanup timer for latest data as we are going to test history records only
            //noinspection JSDeprecatedSymbols
            positionReportsService.destroyPeriodicTimer();

            let subscription = positionReportsService.getPositionReportHistory({
                clearer              : '*',
                member               : '*',
                account              : '*',
                underlying           : '*',
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
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(historyURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                    clearer              : '*',
                    member               : '*',
                    account              : '*',
                    underlying           : '*',
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

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            let subscription2 = positionReportsService.getPositionReportHistory({
                clearer              : 'a',
                member               : 'b',
                account              : 'c',
                underlying           : 'x',
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
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(historyURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                    clearer              : 'a',
                    member               : 'b',
                    account              : 'c',
                    underlying           : 'x',
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

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(2);

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);
            subscription2.unsubscribe();
        })
    ));

    it('chart data are aggregeted', fakeAsync(inject([PositionReportsService, HttpService],
        (positionReportsService: PositionReportsService, http: HttpServiceStub<PositionReportServerData[]>) => {
            let rawData = http.popReturnValue();
            http.returnValue(rawData);
            let subscription = positionReportsService.getPositionReportsChartData()
                .subscribe((data: PositionReportChartData) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(latestURL);
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

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);

            http.returnValue(generatePositionReports());
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(2);
            subscription.unsubscribe();

            // Cleanup timer after test
            //noinspection JSDeprecatedSymbols
            positionReportsService.destroyPeriodicTimer();
        })
    ));

    it('chart data contain select items', fakeAsync(inject([PositionReportsService, HttpService],
        (positionReportsService: PositionReportsService, http: HttpServiceStub<PositionReportServerData[]>) => {
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
            let subscription = positionReportsService.getPositionReportsChartData()
                .subscribe((data: PositionReportChartData) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL).toBe(latestURL);
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

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);

            http.returnValue(generatePositionReports());
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(2);
            subscription.unsubscribe();

            // Cleanup timer after test
            //noinspection JSDeprecatedSymbols
            positionReportsService.destroyPeriodicTimer();
        })
    ));
});