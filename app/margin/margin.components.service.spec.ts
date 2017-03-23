import {TestBed, inject} from '@angular/core/testing';

import {HttpServiceStub, generateMarginComponents} from '../../testing';
import Spy = jasmine.Spy;

import {HttpService, Request} from '../http.service';

import {
    MarginComponentsService, marginComponentsLatestURL,
    marginComponentsHistoryURL, marginComponentsAggregationURL, marginComponentsTreemapURL
} from './margin.components.service';
import {
    MarginComponentsServerData, MarginComponentsRowData, MarginComponentsAggregationData,
    MarginComponentsBaseData, MarginComponentsTree, MarginComponentsTreeNode
} from './margin.types';

describe('MarginComponentsService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MarginComponentsService,
                {
                    provide: HttpService, useClass: HttpServiceStub
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<MarginComponentsServerData[]>) => {
        http.returnValue(generateMarginComponents());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('latest data are correctly processed',
        inject([MarginComponentsService, HttpService],
            (marginComponentsService: MarginComponentsService,
             http: HttpServiceStub<MarginComponentsServerData[]>) => {
                marginComponentsService.getMarginComponentsLatest()
                    .subscribe((data: MarginComponentsRowData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginComponentsLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['*', '*', '*', '*', '*']);
                        expect(data.length).toBe(Math.pow(3, 4));
                        data.forEach((val: MarginComponentsRowData) => {
                            expect(val.variLiqui).toBeDefined();
                            expect(typeof val.variLiqui).toBe('number');
                            expect(val.variLiqui).toBe(val.variationMargin + val.liquiMargin);
                        })
                    });

                http.returnValue(null);
                marginComponentsService.getMarginComponentsLatest('a', 'b', 'c', 'd', 'e')
                    .subscribe((data: MarginComponentsRowData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginComponentsLatestURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['a', 'b', 'c', 'd', 'e']);
                        expect(data).toBeDefined();
                        expect(data.length).toBe(0);
                    });
            })
    );

    it('history data are correctly processed',
        inject([MarginComponentsService, HttpService],
            (marginComponentsService: MarginComponentsService,
             http: HttpServiceStub<MarginComponentsServerData[]>) => {
                marginComponentsService.getMarginComponentsHistory('*', '*', '*', '*', '*')
                    .subscribe((data: MarginComponentsRowData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginComponentsHistoryURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['*', '*', '*', '*', '*']);
                        expect(data.length).toBe(Math.pow(3, 4));
                        data.forEach((val: MarginComponentsRowData) => {
                            expect(val.variLiqui).toBeDefined();
                            expect(typeof val.variLiqui).toBe('number');
                            expect(val.variLiqui).toBe(val.variationMargin + val.liquiMargin);
                        })
                    });

                http.returnValue(null);
                marginComponentsService.getMarginComponentsHistory('a', 'b', 'c', 'd', 'e')
                    .subscribe((data: MarginComponentsRowData[]) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginComponentsHistoryURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params)
                            .toEqual(['a', 'b', 'c', 'd', 'e']);
                        expect(data).toBeDefined();
                        expect(data.length).toBe(0);
                    });
            })
    );

    it('aggregation data are correctly processed',
        inject([MarginComponentsService, HttpService],
            (marginComponentsService: MarginComponentsService,
             http: HttpServiceStub<MarginComponentsServerData[]>) => {
                let originalData = http.popReturnValue();
                http.returnValue(originalData);
                marginComponentsService.getMarginComponentsAggregationData()
                    .subscribe((data: MarginComponentsAggregationData) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginComponentsAggregationURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();
                        expect(data.aggregatedRows.length).toBe(Math.pow(3, 2));
                        expect(data.summary).toBeDefined();

                        let summaryData: MarginComponentsBaseData = {
                            uid: null,
                            variationMargin: 0,
                            liquiMargin: 0,
                            premiumMargin: 0,
                            spreadMargin: 0,
                            additionalMargin: 0
                        };
                        originalData.forEach((record: MarginComponentsServerData) => {
                            summaryData.variationMargin += record.variationMargin;
                            summaryData.liquiMargin += record.liquiMargin;
                            summaryData.premiumMargin += record.premiumMargin;
                            summaryData.spreadMargin += record.spreadMargin;
                            summaryData.additionalMargin += record.additionalMargin;
                        });

                        expect(data.summary.variationMargin).toBe(summaryData.variationMargin);
                        expect(data.summary.liquiMargin).toBe(summaryData.liquiMargin);
                        expect(data.summary.premiumMargin).toBe(summaryData.premiumMargin);
                        expect(data.summary.spreadMargin).toBe(summaryData.spreadMargin);
                        expect(data.summary.additionalMargin).toBe(summaryData.additionalMargin);

                        let sumOfAggregatedData: MarginComponentsBaseData = {
                            uid: null,
                            variationMargin: 0,
                            liquiMargin: 0,
                            premiumMargin: 0,
                            spreadMargin: 0,
                            additionalMargin: 0
                        };
                        data.aggregatedRows.forEach((record: MarginComponentsBaseData) => {
                            sumOfAggregatedData.variationMargin += record.variationMargin;
                            sumOfAggregatedData.liquiMargin += record.liquiMargin;
                            sumOfAggregatedData.premiumMargin += record.premiumMargin;
                            sumOfAggregatedData.spreadMargin += record.spreadMargin;
                            sumOfAggregatedData.additionalMargin += record.additionalMargin;
                        });

                        expect(data.summary.variationMargin).toBe(sumOfAggregatedData.variationMargin);
                        expect(data.summary.liquiMargin).toBe(sumOfAggregatedData.liquiMargin);
                        expect(data.summary.premiumMargin).toBe(sumOfAggregatedData.premiumMargin);
                        expect(data.summary.spreadMargin).toBe(sumOfAggregatedData.spreadMargin);
                        expect(data.summary.additionalMargin).toBe(sumOfAggregatedData.additionalMargin);
                    });

                http.returnValue(null);
                marginComponentsService.getMarginComponentsAggregationData()
                    .subscribe((data: MarginComponentsAggregationData) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginComponentsAggregationURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();
                        expect(data.aggregatedRows).not.toBeDefined();
                        expect(data.summary).not.toBeDefined();
                    });
            })
    );

    it('tree map data are correctly processed',
        inject([MarginComponentsService, HttpService],
            (marginComponentsService: MarginComponentsService,
             http: HttpServiceStub<MarginComponentsServerData[]>) => {
                http.popReturnValue();
                http.returnValue(generateMarginComponents(1, 15, 2, 15));
                marginComponentsService.getMarginComponentsTreeMapData()
                    .subscribe((data: MarginComponentsTree) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginComponentsTreemapURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();
                        let nodesCount = 0;
                        data.traverseDF((node: MarginComponentsTreeNode) => {
                            nodesCount++;

                            if (node.data.leaf) {
                                expect(node.children.length).toBe(0);
                            }
                            if (node.parent && node.children.length) {
                                let value = 0;
                                node.children.forEach((childNode: MarginComponentsTreeNode) => {
                                    value += childNode.data.value;
                                    expect(childNode.data.id).toMatch('^' + node.data.id.replace(/Rest/, ''));
                                });
                                expect(value).toBe(node.data.value);
                            }
                        });
                        expect(nodesCount).toBe(373);
                    });

                http.returnValue(null);
                marginComponentsService.getMarginComponentsTreeMapData()
                    .subscribe((data: MarginComponentsTree) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginComponentsTreemapURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();

                        expect((data as any)._root).not.toBeDefined();
                    });

                http.returnValue([]);
                marginComponentsService.getMarginComponentsTreeMapData()
                    .subscribe((data: MarginComponentsTree) => {
                        expect(httpSyp).toHaveBeenCalledTimes(3);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginComponentsTreemapURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();

                        expect((data as any)._root).not.toBeDefined();
                    });
            })
    );
});