import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {HttpServiceStub} from '@dbg-riskit/dave-ui-testing';

import {Request} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generateLiquiGroupSplitMargin} from '@dave/testing';

import {
    liquiGroupSplitMarginHistoryURL,
    liquiGroupSplitMarginLatestURL,
    LiquiGroupSplitMarginService
} from './liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData, LiquiGroupSplitMarginServerData} from './liqui.group.split.margin.types';

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
                PeriodicHttpService
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
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                        .toEqual({});
                    expect(data.length).toBe(Math.pow(2, 5));
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            let subscription2 = liquiGroupSplitMarginService.getLiquiGroupSplitMarginLatest({
                clearer         : 'a',
                member          : 'b',
                account         : 'c',
                liquidationGroup: 'd'
            }).subscribe((data: LiquiGroupSplitMarginData[]) => {
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                    .toBe(liquiGroupSplitMarginLatestURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                    clearer         : 'a',
                    member          : 'b',
                    account         : 'c',
                    liquidationGroup: 'd'
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

    it('history data are correctly processed', fakeAsync(inject([LiquiGroupSplitMarginService, HttpService],
        (liquiGroupSplitMarginService: LiquiGroupSplitMarginService,
            http: HttpServiceStub<LiquiGroupSplitMarginServerData[]>) => {
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