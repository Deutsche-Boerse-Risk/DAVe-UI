import {TestBed, inject} from '@angular/core/testing';

import {HttpServiceStub, generateLiquiGroupMargin} from '../../testing';
import Spy = jasmine.Spy;

import {HttpService, Request} from '../http.service';

import {
    LiquiGroupMarginService,
    liquiGroupMarginLatestURL,
    liquiGroupMarginHistoryURL
} from './liqui.group.margin.service';
import {LiquiGroupMarginServerData, LiquiGroupMarginData} from './liqui.group.margin.types';

describe('LiquiGroupMarginService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LiquiGroupMarginService,
                {
                    provide : HttpService,
                    useClass: HttpServiceStub
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<LiquiGroupMarginServerData[]>) => {
        http.returnValue(generateLiquiGroupMargin());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed',
        inject([LiquiGroupMarginService, HttpService],
            (liquiGroupMarginService: LiquiGroupMarginService,
                http: HttpServiceStub<LiquiGroupMarginServerData[]>) => {
                liquiGroupMarginService.getLiquiGroupMarginLatest({})
                    .subscribe((data: LiquiGroupMarginData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(liquiGroupMarginLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual({});
                        expect(data.length).toBe(Math.pow(2, 4));
                    });

                http.returnValue(null);
                liquiGroupMarginService.getLiquiGroupMarginLatest({
                    clearer       : 'a',
                    member        : 'b',
                    account       : 'c',
                    marginClass   : 'd',
                    marginCurrency: 'e'
                }).subscribe((data: LiquiGroupMarginData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(2);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(liquiGroupMarginLatestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                        clearer       : 'a',
                        member        : 'b',
                        account       : 'c',
                        marginClass   : 'd',
                        marginCurrency: 'e'
                    });
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });
            })
    );

    it('history data are correctly processed',
        inject([LiquiGroupMarginService, HttpService],
            (liquiGroupMarginService: LiquiGroupMarginService,
                http: HttpServiceStub<LiquiGroupMarginServerData[]>) => {
                liquiGroupMarginService.getLiquiGroupMarginHistory({
                    clearer       : '*',
                    member        : '*',
                    account       : '*',
                    marginClass   : '*',
                    marginCurrency: '*'
                }).subscribe((data: LiquiGroupMarginData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(1);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(liquiGroupMarginHistoryURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                        clearer       : '*',
                        member        : '*',
                        account       : '*',
                        marginClass   : '*',
                        marginCurrency: '*'
                    });
                    expect(data.length).toBe(Math.pow(2, 4));
                });

                http.returnValue(null);
                liquiGroupMarginService.getLiquiGroupMarginHistory({
                    clearer       : 'a',
                    member        : 'b',
                    account       : 'c',
                    marginClass   : 'd',
                    marginCurrency: 'e'
                }).subscribe((data: LiquiGroupMarginData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(2);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(liquiGroupMarginHistoryURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual({
                        clearer       : 'a',
                        member        : 'b',
                        account       : 'c',
                        marginClass   : 'd',
                        marginCurrency: 'e'
                    });
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });
            })
    );
});