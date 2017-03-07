import {TestBed, inject} from "@angular/core/testing";

import {HttpServiceStub, generateMarginComponents} from "../../testing";
import Spy = jasmine.Spy;

import {HttpService, Request} from "../http.service";

import {
    MarginComponentsService, marginComponentsLatestURL,
    marginComponentsHistoryURL, marginComponentsAggregationURL, marginComponentsTreemapURL
} from "./margin.components.service";
import {
    MarginComponentsServerData, MarginComponentsRowData, MarginComponentsAggregationData,
    MarginComponentsBaseData, MarginComponentsTree
} from "./margin.types";

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
        inject([MarginComponentsService, HttpService], (positionReportsService: MarginComponentsService,
                                                        http: HttpServiceStub<MarginComponentsServerData[]>) => {
            positionReportsService.getMarginComponentsLatest().subscribe((data: MarginComponentsRowData[]) => {
                expect(httpSyp).toHaveBeenCalledTimes(1);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                    .toBe(marginComponentsLatestURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual(['*', '*', '*', '*', '*']);
                expect(data.length).toBe(Math.pow(3, 4));
                data.forEach((val: MarginComponentsRowData) => {
                    expect(val.variLiqui).toBeDefined();
                    expect(typeof val.variLiqui).toBe('number');
                    expect(val.variLiqui).toBe(val.variationMargin + val.liquiMargin);
                })
            });

            http.returnValue(null);
            positionReportsService.getMarginComponentsLatest('a', 'b', 'c', 'd', 'e')
                .subscribe((data: MarginComponentsRowData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(2);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(marginComponentsLatestURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual(['a', 'b', 'c', 'd', 'e']);
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });
        })
    );

    it('history data are correctly processed',
        inject([MarginComponentsService, HttpService], (positionReportsService: MarginComponentsService,
                                                        http: HttpServiceStub<MarginComponentsServerData[]>) => {
            positionReportsService.getMarginComponentsHistory('*', '*', '*', '*', '*').subscribe((data: MarginComponentsRowData[]) => {
                expect(httpSyp).toHaveBeenCalledTimes(1);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                    .toBe(marginComponentsHistoryURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual(['*', '*', '*', '*', '*']);
                expect(data.length).toBe(Math.pow(3, 4));
                data.forEach((val: MarginComponentsRowData) => {
                    expect(val.variLiqui).toBeDefined();
                    expect(typeof val.variLiqui).toBe('number');
                    expect(val.variLiqui).toBe(val.variationMargin + val.liquiMargin);
                })
            });

            http.returnValue(null);
            positionReportsService.getMarginComponentsHistory('a', 'b', 'c', 'd', 'e')
                .subscribe((data: MarginComponentsRowData[]) => {
                    expect(httpSyp).toHaveBeenCalledTimes(2);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(marginComponentsHistoryURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).toEqual(['a', 'b', 'c', 'd', 'e']);
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });
        })
    );

    it('aggregation data are correctly processed',
        inject([MarginComponentsService, HttpService], (positionReportsService: MarginComponentsService,
                                                        http: HttpServiceStub<MarginComponentsServerData[]>) => {
            let originalData = http.popReturnValue();
            http.returnValue(originalData);
            positionReportsService.getMarginComponentsAggregationData().subscribe((data: MarginComponentsAggregationData) => {
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
            positionReportsService.getMarginComponentsAggregationData()
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

    xit('tree map data are correctly processed',
        inject([MarginComponentsService, HttpService], (positionReportsService: MarginComponentsService,
                                                        http: HttpServiceStub<MarginComponentsServerData[]>) => {
            let originalData = http.popReturnValue();
            http.returnValue(originalData);
            positionReportsService.getMarginComponentsTreeMapData().subscribe((data: MarginComponentsTree) => {
                expect(httpSyp).toHaveBeenCalledTimes(1);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                    .toBe(marginComponentsTreemapURL);
                expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();

            });

            http.returnValue(null);
            positionReportsService.getMarginComponentsTreeMapData()
                .subscribe((data: MarginComponentsTree) => {
                    expect(httpSyp).toHaveBeenCalledTimes(2);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                        .toBe(marginComponentsTreemapURL);
                    expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();
                });
        })
    );
});