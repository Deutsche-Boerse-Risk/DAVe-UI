import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {AuthServiceStub, HttpServiceStub} from '@dbg-riskit/dave-ui-testing';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {Request, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generateLiquiGroupSplitMargin} from '@dave/testing';

import {
    liquiGroupSplitMarginHistoryURL,
    liquiGroupSplitMarginLatestURL,
    LiquiGroupSplitMarginService
} from './liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData, LiquiGroupSplitMarginServerData} from './liqui.group.split.margin.types';

import {ErrorCollectorService} from '../error/error.collector';
import {DATA_REFRESH_INTERVAL, PeriodicHttpService} from '../periodic.http.service';
import Spy = jasmine.Spy;

describe('LiquiGroupSplitMarginService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LiquiGroupSplitMarginService,
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

    beforeEach(inject([HttpService], (http: HttpServiceStub<LiquiGroupSplitMarginServerData[]>) => {
        http.returnValue(generateLiquiGroupSplitMargin());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed', fakeAsync(inject([LiquiGroupSplitMarginService, HttpService],
        (liquiGroupSplitMarginService: LiquiGroupSplitMarginService,
            http: HttpServiceStub<LiquiGroupSplitMarginServerData[]>) => {
            let subscription = liquiGroupSplitMarginService.getLiquiGroupSplitMarginLatest({})
                .subscribe((data: LiquiGroupSplitMarginData[]) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(liquiGroupSplitMarginLatestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toBeUndefined();
                    expect(data.length).toBe(Math.pow(2, 5));
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue([
                {
                    clearer              : 'a',
                    member               : 'b',
                    account              : 'c',
                    liquidationGroup     : 'd',
                    liquidationGroupSplit: 'e',
                    marginCurrency       : 'f'
                },
                {
                    clearer              : 'aa',
                    member               : 'b',
                    account              : 'c',
                    liquidationGroup     : 'd',
                    liquidationGroupSplit: 'e',
                    marginCurrency       : 'f'
                },
                {
                    clearer              : 'a',
                    member               : 'ba',
                    account              : 'c',
                    liquidationGroup     : 'd',
                    liquidationGroupSplit: 'e',
                    marginCurrency       : 'f'
                },
                {
                    clearer              : 'a',
                    member               : 'b',
                    account              : 'ca',
                    liquidationGroup     : 'd',
                    liquidationGroupSplit: 'e',
                    marginCurrency       : 'f'
                },
                {
                    clearer              : 'a',
                    member               : 'b',
                    account              : 'c',
                    liquidationGroup     : 'da',
                    liquidationGroupSplit: 'e',
                    marginCurrency       : 'f'
                },
                {
                    clearer              : 'a',
                    member               : 'b',
                    account              : 'c',
                    liquidationGroup     : 'd',
                    liquidationGroupSplit: 'ea',
                    marginCurrency       : 'f'
                }
            ] as LiquiGroupSplitMarginServerData[]);
            tick(DATA_REFRESH_INTERVAL);

            let subscription2 = liquiGroupSplitMarginService.getLiquiGroupSplitMarginLatest({
                clearer              : 'a',
                member               : 'b',
                account              : 'c',
                liquidationGroup     : 'd',
                liquidationGroupSplit: 'e'
            }).subscribe((data: LiquiGroupSplitMarginData[]) => {
                expect(data).toBeDefined();
                expect(data.length).toBe(1);
                expect(data[0].uid).toEqual(UIDUtils.computeUID('a', 'b', 'c', 'd', 'e', 'f', null));
            });

            expect(httpSyp).toHaveBeenCalledTimes(2);
            subscription2.unsubscribe();

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);

            let subscription3 = liquiGroupSplitMarginService.getLiquiGroupSplitMarginLatest({})
                .subscribe((data: LiquiGroupSplitMarginData[]) => {
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(4);
            subscription3.unsubscribe();

            // Cleanup timer after test
            //noinspection JSDeprecatedSymbols
            liquiGroupSplitMarginService.destroyPeriodicTimer();
        })
    ));

    it('history data are correctly processed', fakeAsync(inject([LiquiGroupSplitMarginService, HttpService],
        (liquiGroupSplitMarginService: LiquiGroupSplitMarginService,
            http: HttpServiceStub<LiquiGroupSplitMarginServerData[]>) => {

            // Cleanup timer for latest data as we are going to test history records only
            //noinspection JSDeprecatedSymbols
            liquiGroupSplitMarginService.destroyPeriodicTimer();

            let subscription = liquiGroupSplitMarginService.getLiquiGroupSplitMarginHistory({
                clearer              : '*',
                member               : '*',
                account              : '*',
                liquidationGroup     : '*',
                liquidationGroupSplit: '*',
                marginCurrency       : '*'
            }).subscribe((data: LiquiGroupSplitMarginData[]) => {
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                    .toBe(liquiGroupSplitMarginHistoryURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                    clearer              : '*',
                    member               : '*',
                    account              : '*',
                    liquidationGroup     : '*',
                    liquidationGroupSplit: '*',
                    marginCurrency       : '*'
                });
                expect(data.length).toBe(Math.pow(2, 5));
            });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            let subscription2 = liquiGroupSplitMarginService.getLiquiGroupSplitMarginHistory({
                clearer              : 'a',
                member               : 'b',
                account              : 'c',
                liquidationGroup     : 'd',
                liquidationGroupSplit: 'e',
                marginCurrency       : 'f'
            }).subscribe((data: LiquiGroupSplitMarginData[]) => {
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                    .toBe(liquiGroupSplitMarginHistoryURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                    clearer              : 'a',
                    member               : 'b',
                    account              : 'c',
                    liquidationGroup     : 'd',
                    liquidationGroupSplit: 'e',
                    marginCurrency       : 'f'
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