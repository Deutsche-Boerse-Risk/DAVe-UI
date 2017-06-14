import {inject, TestBed} from '@angular/core/testing';

import {HttpServiceStub} from '@dbg-riskit/DAVe-UI-testing';

import {Request} from '@dbg-riskit/DAVe-UI-common';
import {HttpService} from '@dbg-riskit/DAVe-UI-http';

import {generateLiquiGroupSplitMargin} from '../../testing';

import {
    liquiGroupSplitMarginHistoryURL,
    liquiGroupSplitMarginLatestURL,
    LiquiGroupSplitMarginService
} from './liqui.group.split.margin.service';
import {LiquiGroupSplitMarginData, LiquiGroupSplitMarginServerData} from './liqui.group.split.margin.types';

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
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<LiquiGroupSplitMarginServerData[]>) => {
        http.returnValue(generateLiquiGroupSplitMargin());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed',
        inject([LiquiGroupSplitMarginService, HttpService],
            (liquiGroupSplitMarginService: LiquiGroupSplitMarginService,
                http: HttpServiceStub<LiquiGroupSplitMarginServerData[]>) => {
                liquiGroupSplitMarginService.getLiquiGroupSplitMarginLatest({})
                    .subscribe((data: LiquiGroupSplitMarginData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(liquiGroupSplitMarginLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual({});
                        expect(data.length).toBe(Math.pow(2, 5));
                    });

                http.returnValue(null);
                liquiGroupSplitMarginService.getLiquiGroupSplitMarginLatest({
                    clearer         : 'a',
                    member          : 'b',
                    account         : 'c',
                    liquidationGroup: 'd'
                }).subscribe((data: LiquiGroupSplitMarginData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(2);
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
            })
    );

    it('history data are correctly processed',
        inject([LiquiGroupSplitMarginService, HttpService],
            (liquiGroupSplitMarginService: LiquiGroupSplitMarginService,
                http: HttpServiceStub<LiquiGroupSplitMarginServerData[]>) => {
                liquiGroupSplitMarginService.getLiquiGroupSplitMarginHistory({
                    clearer              : '*',
                    member               : '*',
                    account              : '*',
                    liquidationGroup     : '*',
                    liquidationGroupSplit: '*',
                    marginCurrency       : '*'
                }).subscribe((data: LiquiGroupSplitMarginData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(1);
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

                http.returnValue(null);
                liquiGroupSplitMarginService.getLiquiGroupSplitMarginHistory({
                    clearer              : 'a',
                    member               : 'b',
                    account              : 'c',
                    liquidationGroup     : 'd',
                    liquidationGroupSplit: 'e',
                    marginCurrency       : 'f'
                }).subscribe((data: LiquiGroupSplitMarginData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(2);
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
            })
    );
});