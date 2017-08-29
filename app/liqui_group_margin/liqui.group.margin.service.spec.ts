import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {AuthServiceStub, HttpServiceStub} from '@dbg-riskit/dave-ui-testing';

import {AUTH_PROVIDER, Request, UIDUtils} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generateLiquiGroupMargin} from '@dave/testing';

import {
    liquiGroupMarginHistoryURL,
    liquiGroupMarginLatestURL,
    LiquiGroupMarginService
} from './liqui.group.margin.service';

import {
    LiquiGroupMarginData,
    LiquiGroupMarginServerData,
    LiquiGroupMarginTree,
    LiquiGroupMarginTreeNode
} from './liqui.group.margin.types';

import {DATA_REFRESH_INTERVAL, PeriodicHttpService} from '../periodic.http.service';
import Spy = jasmine.Spy;

describe('LiquiGroupMarginService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LiquiGroupMarginService,
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

    beforeEach(inject([HttpService], (http: HttpServiceStub<LiquiGroupMarginServerData[]>) => {
        http.returnValue(generateLiquiGroupMargin());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('tree map data are correctly processed', fakeAsync(inject([LiquiGroupMarginService, HttpService],
        (liquiGroupMarginService: LiquiGroupMarginService,
            http: HttpServiceStub<LiquiGroupMarginServerData[]>) => {
            http.popReturnValue();
            http.returnValue(generateLiquiGroupMargin(1, 15, 2, 15));
            let subscription = liquiGroupMarginService.getLiquiGroupMarginTreeMapData()
                .subscribe((data: LiquiGroupMarginTree) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(liquiGroupMarginLatestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();
                    let nodesCount = 0;
                    data.traverseDF((node: LiquiGroupMarginTreeNode) => {
                        nodesCount++;

                        if (node.leaf) {
                            expect(node.children.length).toBe(0);
                        }
                        if (node.parent && node.children.length) {
                            let additionalMarginSum = 0;
                            node.children.forEach((childNode: LiquiGroupMarginTreeNode) => {
                                additionalMarginSum += childNode.data.additionalMargin;
                                expect(childNode.data.id).toMatch('^' + node.data.id.replace(/Rest/, ''));
                            });
                            expect(Math.round(additionalMarginSum * Math.pow(10, 5)))
                                .toBe(Math.round(node.data.additionalMargin * Math.pow(10, 5)));
                        }
                    });
                    expect(nodesCount).toBe(528);
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            let subscription2 = liquiGroupMarginService.getLiquiGroupMarginTreeMapData()
                .subscribe((data: LiquiGroupMarginTree) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(liquiGroupMarginLatestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();

                    expect((data as any)._root).not.toBeDefined();
                });

            expect(httpSyp).toHaveBeenCalledTimes(2);
            subscription2.unsubscribe();

            http.returnValue([]);
            tick(DATA_REFRESH_INTERVAL);
            let subscription3 = liquiGroupMarginService.getLiquiGroupMarginTreeMapData()
                .subscribe((data: LiquiGroupMarginTree) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(liquiGroupMarginLatestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();

                    expect((data as any)._root).not.toBeDefined();
                });

            expect(httpSyp).toHaveBeenCalledTimes(3);

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(4);
            subscription3.unsubscribe();

            // Cleanup timer after test
            //noinspection JSDeprecatedSymbols
            liquiGroupMarginService.destroyPeriodicTimer();
        })
    ));

    it('latest data are correctly processed', fakeAsync(inject([LiquiGroupMarginService, HttpService],
        (liquiGroupMarginService: LiquiGroupMarginService,
            http: HttpServiceStub<LiquiGroupMarginServerData[]>) => {
            let subscription = liquiGroupMarginService.getLiquiGroupMarginLatest({})
                .subscribe((data: LiquiGroupMarginData[]) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(liquiGroupMarginLatestURL);
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
                    marginClass   : 'd',
                    marginCurrency: 'e'
                },
                {
                    clearer       : 'aa',
                    member        : 'b',
                    account       : 'c',
                    marginClass   : 'd',
                    marginCurrency: 'e'
                },
                {
                    clearer       : 'a',
                    member        : 'ba',
                    account       : 'c',
                    marginClass   : 'd',
                    marginCurrency: 'e'
                },
                {
                    clearer       : 'a',
                    member        : 'b',
                    account       : 'ca',
                    marginClass   : 'd',
                    marginCurrency: 'e'
                },
                {
                    clearer       : 'a',
                    member        : 'b',
                    account       : 'c',
                    marginClass   : 'da',
                    marginCurrency: 'e'
                },
                {
                    clearer       : 'a',
                    member        : 'b',
                    account       : 'c',
                    marginClass   : 'd',
                    marginCurrency: 'ea'
                }
            ] as LiquiGroupMarginServerData[]);
            tick(DATA_REFRESH_INTERVAL);

            let subscription2 = liquiGroupMarginService.getLiquiGroupMarginLatest({
                clearer       : 'a',
                member        : 'b',
                account       : 'c',
                marginClass   : 'd',
                marginCurrency: 'e'
            }).subscribe((data: LiquiGroupMarginData[]) => {
                expect(data).toBeDefined();
                expect(data.length).toBe(1);
                expect(data[0].uid).toEqual(UIDUtils.computeUID('a', 'b', 'c', 'd', 'e', null));
            });

            expect(httpSyp).toHaveBeenCalledTimes(2);
            subscription2.unsubscribe();

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);

            let subscription3 = liquiGroupMarginService.getLiquiGroupMarginLatest({})
                .subscribe((data: LiquiGroupMarginData[]) => {
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(4);
            subscription3.unsubscribe();

            // Cleanup timer after test
            //noinspection JSDeprecatedSymbols
            liquiGroupMarginService.destroyPeriodicTimer();
        })
    ));

    it('history data are correctly processed', fakeAsync(inject([LiquiGroupMarginService, HttpService],
        (liquiGroupMarginService: LiquiGroupMarginService,
            http: HttpServiceStub<LiquiGroupMarginServerData[]>) => {

            // Cleanup timer for latest data as we are going to test history records only
            //noinspection JSDeprecatedSymbols
            liquiGroupMarginService.destroyPeriodicTimer();

            let subscription = liquiGroupMarginService.getLiquiGroupMarginHistory({
                clearer       : '*',
                member        : '*',
                account       : '*',
                marginClass   : '*',
                marginCurrency: '*'
            }).subscribe((data: LiquiGroupMarginData[]) => {
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

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            let subscription2 = liquiGroupMarginService.getLiquiGroupMarginHistory({
                clearer       : 'a',
                member        : 'b',
                account       : 'c',
                marginClass   : 'd',
                marginCurrency: 'e'
            }).subscribe((data: LiquiGroupMarginData[]) => {
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

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(2);

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);
            subscription2.unsubscribe();
        })
    ));
});