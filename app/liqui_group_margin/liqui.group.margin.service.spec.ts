import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {HttpServiceStub} from '@dbg-riskit/dave-ui-testing';

import {Request} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {generateLiquiGroupMargin} from '@dave/testing';

import {
    liquiGroupMarginAggregationURL,
    liquiGroupMarginHistoryURL,
    liquiGroupMarginLatestURL,
    LiquiGroupMarginService,
    liquiGroupMarginTreemapURL
} from './liqui.group.margin.service';

import {
    LiquiGroupMarginAggregationData,
    LiquiGroupMarginBaseData,
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
                PeriodicHttpService
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
                        .toBe(liquiGroupMarginTreemapURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();
                    let nodesCount = 0;
                    data.traverseDF((node: LiquiGroupMarginTreeNode) => {
                        nodesCount++;

                        if (node.data.leaf) {
                            expect(node.children.length).toBe(0);
                        }
                        if (node.parent && node.children.length) {
                            let value = 0;
                            node.children.forEach((childNode: LiquiGroupMarginTreeNode) => {
                                value += childNode.data.value;
                                expect(childNode.data.id).toMatch('^' + node.data.id.replace(/Rest/, ''));
                            });
                            expect(Math.round(value * Math.pow(10, 5)))
                                .toBe(Math.round(node.data.value * Math.pow(10, 5)));
                        }
                    });
                    expect(nodesCount).toBe(373);
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            let subscription2 = liquiGroupMarginService.getLiquiGroupMarginTreeMapData()
                .subscribe((data: LiquiGroupMarginTree) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(liquiGroupMarginTreemapURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();

                    expect((data as any)._root).not.toBeDefined();
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(2);
            subscription2.unsubscribe();

            http.returnValue([]);
            let subscription3 = liquiGroupMarginService.getLiquiGroupMarginTreeMapData()
                .subscribe((data: LiquiGroupMarginTree) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(liquiGroupMarginTreemapURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();

                    expect((data as any)._root).not.toBeDefined();
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(3);

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(4);
            subscription3.unsubscribe();
        })
    ));

    it('aggregation data are correctly processed', fakeAsync(inject([LiquiGroupMarginService, HttpService],
        (liquiGroupMarginService: LiquiGroupMarginService,
            http: HttpServiceStub<LiquiGroupMarginServerData[]>) => {
            let originalData = http.popReturnValue();
            http.returnValue(originalData);
            let subscription = liquiGroupMarginService.getLiquiGroupMarginAggregationData()
                .subscribe((data: LiquiGroupMarginAggregationData) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(liquiGroupMarginAggregationURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();
                    expect(data.aggregatedRows.length).toBe(Math.pow(2, 3));
                    expect(data.summary).toBeDefined();

                    let summaryData: LiquiGroupMarginBaseData = {
                        premiumMargin              : 0,
                        currentLiquidatingMargin   : 0,
                        additionalMargin           : 0,
                        unadjustedMarginRequirement: 0,
                        variationPremiumPayment    : 0
                    };
                    originalData.forEach((record: LiquiGroupMarginServerData) => {
                        summaryData.premiumMargin += record.premiumMargin;
                        summaryData.currentLiquidatingMargin += record.currentLiquidatingMargin;
                        summaryData.additionalMargin += record.additionalMargin;
                        summaryData.unadjustedMarginRequirement += record.unadjustedMarginRequirement;
                        summaryData.variationPremiumPayment += record.variationPremiumPayment;
                    });

                    expect(data.summary).toEqual(summaryData);

                    let sumOfAggregatedData: LiquiGroupMarginBaseData = {
                        premiumMargin              : 0,
                        currentLiquidatingMargin   : 0,
                        additionalMargin           : 0,
                        unadjustedMarginRequirement: 0,
                        variationPremiumPayment    : 0
                    };
                    data.aggregatedRows.forEach((record: LiquiGroupMarginData) => {
                        sumOfAggregatedData.premiumMargin += record.premiumMargin;
                        sumOfAggregatedData.currentLiquidatingMargin += record.currentLiquidatingMargin;
                        sumOfAggregatedData.additionalMargin += record.additionalMargin;
                        sumOfAggregatedData.unadjustedMarginRequirement += record.unadjustedMarginRequirement;
                        sumOfAggregatedData.variationPremiumPayment += record.variationPremiumPayment;
                    });

                    // We have to use ceil here as we loose precision in the aggregated row sums
                    Object.keys(data.summary).forEach((key: string) => {
                        expect(Math.round((data.summary as any)[key] * Math.pow(10, 5)))
                            .toBe(Math.round((sumOfAggregatedData as any)[key] * Math.pow(10, 5)));
                    });

                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            let subscription2 = liquiGroupMarginService.getLiquiGroupMarginAggregationData()
                .subscribe((data: LiquiGroupMarginAggregationData) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(liquiGroupMarginAggregationURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();
                    expect(data.aggregatedRows).not.toBeDefined();
                    expect(data.summary).not.toBeDefined();
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(2);

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);
            subscription2.unsubscribe();
        })
    ));

    it('latest data are correctly processed', fakeAsync(inject([LiquiGroupMarginService, HttpService],
        (liquiGroupMarginService: LiquiGroupMarginService,
            http: HttpServiceStub<LiquiGroupMarginServerData[]>) => {
            let subscription = liquiGroupMarginService.getLiquiGroupMarginLatest({})
                .subscribe((data: LiquiGroupMarginData[]) => {
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(liquiGroupMarginLatestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                        .toEqual({});
                    expect(data.length).toBe(Math.pow(2, 4));
                });

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(1);
            subscription.unsubscribe();

            http.returnValue(null);
            let subscription2 = liquiGroupMarginService.getLiquiGroupMarginLatest({
                clearer       : 'a',
                member        : 'b',
                account       : 'c',
                marginClass   : 'd',
                marginCurrency: 'e'
            }).subscribe((data: LiquiGroupMarginData[]) => {
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

            tick();
            expect(httpSyp).toHaveBeenCalledTimes(2);

            http.returnValue(null);
            tick(DATA_REFRESH_INTERVAL);
            expect(httpSyp).toHaveBeenCalledTimes(3);
            subscription2.unsubscribe();
        })
    ));

    it('history data are correctly processed', fakeAsync(inject([LiquiGroupMarginService, HttpService],
        (liquiGroupMarginService: LiquiGroupMarginService,
            http: HttpServiceStub<LiquiGroupMarginServerData[]>) => {
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