import {inject, TestBed} from '@angular/core/testing';

import {HttpServiceStub} from '@dbg-riskit/dave-ui-testing';

import {Request} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generateAccountMargin} from '../../testing';

import {accountMarginHistoryURL, accountMarginLatestURL, AccountMarginService} from './account.margin.service';
import {AccountMarginData, AccountMarginServerData} from './account.margin.types';

import Spy = jasmine.Spy;

describe('AccountMarginService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AccountMarginService,
                {
                    provide : HttpService,
                    useClass: HttpServiceStub
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<AccountMarginServerData[]>) => {
        http.returnValue(generateAccountMargin());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed',
        inject([AccountMarginService, HttpService],
            (accountMarginService: AccountMarginService,
                http: HttpServiceStub<AccountMarginServerData[]>) => {
                accountMarginService.getAccountMarginLatest({}).subscribe((data: AccountMarginData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(1);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(accountMarginLatestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                        .toEqual({});
                    expect(data.length).toBe(Math.pow(2, 4));
                });

                http.returnValue(null);
                accountMarginService.getAccountMarginLatest({
                    clearer       : 'a',
                    member        : 'b',
                    account       : 'c',
                    marginCurrency: 'd'
                }).subscribe((data: AccountMarginData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(2);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(accountMarginLatestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                        .toEqual({
                            clearer       : 'a',
                            member        : 'b',
                            account       : 'c',
                            marginCurrency: 'd'
                        });
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });
            })
    );

    it('history data are correctly processed',
        inject([AccountMarginService, HttpService],
            (accountMarginService: AccountMarginService,
                http: HttpServiceStub<AccountMarginServerData[]>) => {
                accountMarginService.getAccountMarginHistory({
                    clearer       : '*',
                    member        : '*',
                    account       : '*',
                    marginCurrency: '*'
                }).subscribe((data: AccountMarginData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(1);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(accountMarginHistoryURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                        .toEqual({
                            clearer       : '*',
                            member        : '*',
                            account       : '*',
                            marginCurrency: '*'
                        });
                    expect(data.length).toBe(Math.pow(2, 4));
                });

                http.returnValue(null);
                accountMarginService.getAccountMarginHistory({
                    clearer       : 'a',
                    member        : 'b',
                    account       : 'c',
                    marginCurrency: 'd'
                }).subscribe((data: AccountMarginData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(2);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(accountMarginHistoryURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                        .toEqual({
                            clearer       : 'a',
                            member        : 'b',
                            account       : 'c',
                            marginCurrency: 'd'
                        });
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });
            })
    );
});