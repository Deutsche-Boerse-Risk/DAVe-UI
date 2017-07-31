import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {AuthServiceStub, HttpServiceStub} from '@dbg-riskit/dave-ui-testing';

import {AUTH_PROVIDER, Request, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generateAccountMargin} from '@dave/testing';

import {accountMarginHistoryURL, accountMarginLatestURL, AccountMarginService} from './account.margin.service';
import {AccountMarginData, AccountMarginServerData} from './account.margin.types';

import {DATA_REFRESH_INTERVAL, PeriodicHttpService} from '../periodic.http.service';
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
                },
                PeriodicHttpService,
                ErrorCollectorService,
                {
                    provide : AUTH_PROVIDER,
                    useClass: AuthServiceStub
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<AccountMarginServerData[]>) => {
        http.returnValue(generateAccountMargin());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed', fakeAsync(inject([AccountMarginService, HttpService],
        (accountMarginService: AccountMarginService,
            http: HttpServiceStub<AccountMarginServerData[]>) => {
            let subscription = accountMarginService.getAccountMarginLatest({})
                .subscribe((data: AccountMarginData[]) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(accountMarginLatestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toBeUndefined();
                    expect(data.length).toBe(Math.pow(2, 4));
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue([
                {
                    clearer       : 'a',
                    member        : 'b',
                    account       : 'c',
                    marginCurrency: 'd'
                },
                {
                    clearer       : 'aa',
                    member        : 'b',
                    account       : 'c',
                    marginCurrency: 'd'
                },
                {
                    clearer       : 'a',
                    member        : 'ba',
                    account       : 'c',
                    marginCurrency: 'd'
                },
                {
                    clearer       : 'a',
                    member        : 'b',
                    account       : 'ca',
                    marginCurrency: 'd'
                },
                {
                    clearer       : 'a',
                    member        : 'b',
                    account       : 'c',
                    marginCurrency: 'da'
                }
            ] as AccountMarginServerData[]);
            tick(DATA_REFRESH_INTERVAL);

            let subscription2 = accountMarginService.getAccountMarginLatest({
                clearer       : 'a',
                member        : 'b',
                account       : 'c',
                marginCurrency: 'd'
            }).subscribe((data: AccountMarginData[]) => {
                expect(data).toBeDefined();
                expect(data.length).toBe(1);
                expect(data[0].uid).toEqual(UIDUtils.computeUID('a', 'b', 'c', 'd', null));
            });

            expect(httpSyp).toHaveBeenCalledTimes(2);
            subscription2.unsubscribe();

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);

            let subscription3 = accountMarginService.getAccountMarginLatest({})
                .subscribe((data: AccountMarginData[]) => {
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(4);
            subscription3.unsubscribe();

            // Cleanup timer after test
            //noinspection JSDeprecatedSymbols
            accountMarginService.destroyPeriodicTimer();
        })
    ));

    it('history data are correctly processed', fakeAsync(inject([AccountMarginService, HttpService],
        (accountMarginService: AccountMarginService,
            http: HttpServiceStub<AccountMarginServerData[]>) => {

            // Cleanup timer for latest data as we are going to test history records only
            //noinspection JSDeprecatedSymbols
            accountMarginService.destroyPeriodicTimer();

            let subscription = accountMarginService.getAccountMarginHistory({
                clearer       : '*',
                member        : '*',
                account       : '*',
                marginCurrency: '*'
            }).subscribe((data: AccountMarginData[]) => {
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

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            let subscription2 = accountMarginService.getAccountMarginHistory({
                clearer       : 'a',
                member        : 'b',
                account       : 'c',
                marginCurrency: 'd'
            }).subscribe((data: AccountMarginData[]) => {
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

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(2);

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);
            subscription2.unsubscribe();
        })
    ));
});