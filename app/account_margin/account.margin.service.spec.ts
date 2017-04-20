import {TestBed, inject} from '@angular/core/testing';

import {HttpServiceStub, generateAccountMargin} from '../../testing';
import Spy = jasmine.Spy;

import {HttpService, Request} from '../http.service';

import {AccountMarginService, accountMarginLatestURL, accountMarginHistoryURL} from './account.margin.service';
import {AccountMarginServerData, AccountMarginData} from './account.margin.types';

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