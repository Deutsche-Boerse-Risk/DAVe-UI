import {Injectable} from '@angular/core';
import {AbstractHttpService} from '../abstract.http.service';
import {Http} from '@angular/http';

import {AuthHttp} from 'angular2-jwt';

import {
    MarginComponentsServerData,
    MarginComponentsAggregationData,
    MarginComponentsBaseData,
    MarginComponentsRowData
} from './margin.types';

const marginComponentsAggregationURL: string = '/mc/latest/';
const marginComponentsLatestURL: string = '/mc/latest/:0/:1/:2/:3/:4';
const marginComponentsHistoryURL: string = '/mc/history/:0/:1/:2/:3/:4';

@Injectable()
export class MarginComponentsService extends AbstractHttpService<MarginComponentsServerData[]> {

    constructor(http: Http, authHttp: AuthHttp) {
        super(http, authHttp);
    }

    public getMarginComponentsAggregationData(): Promise<MarginComponentsAggregationData> {
        return new Promise((resolve, reject) => {
            this.get({resourceURL: marginComponentsAggregationURL}).subscribe((data: MarginComponentsServerData[]) => {
                if (!data) {
                    resolve({});
                    return;
                }
                let newViewWindow: {[key: string]: MarginComponentsBaseData} = {};
                let footerData: MarginComponentsBaseData = {
                    variationMargin: 0,
                    liquiMargin: 0,
                    premiumMargin: 0,
                    spreadMargin: 0,
                    additionalMargin: 0
                };

                for (let index = 0; index < data.length; ++index) {
                    let record = data[index];
                    let fKey = record.clearer + '-' + record.member + '-' + record.account;

                    if (fKey in newViewWindow) {
                        let cellData: MarginComponentsBaseData = newViewWindow[fKey];
                        cellData.variationMargin += record.variationMargin;
                        cellData.liquiMargin += record.liquiMargin;
                        cellData.premiumMargin += record.premiumMargin;
                        cellData.spreadMargin += record.spreadMargin;
                        cellData.additionalMargin += record.additionalMargin;

                        footerData.variationMargin += record.variationMargin;
                        footerData.liquiMargin += record.liquiMargin;
                        footerData.premiumMargin += record.premiumMargin;
                        footerData.spreadMargin += record.spreadMargin;
                        footerData.additionalMargin += record.additionalMargin;
                    }
                    else {
                        newViewWindow[fKey] = {
                            clearer: record.clearer,
                            member: record.member,
                            account: record.account,
                            premiumMargin: record.premiumMargin,
                            additionalMargin: record.additionalMargin,
                            liquiMargin: record.liquiMargin,
                            spreadMargin: record.spreadMargin,
                            variationMargin: record.variationMargin
                        };

                        footerData.variationMargin += record.variationMargin;
                        footerData.liquiMargin += record.liquiMargin;
                        footerData.premiumMargin += record.premiumMargin;
                        footerData.spreadMargin += record.spreadMargin;
                        footerData.additionalMargin += record.additionalMargin;
                    }
                }

                let result: MarginComponentsAggregationData = {
                    aggregatedRows: Object.keys(newViewWindow).map((key: string) => {
                        newViewWindow[key].absAdditionalMargin = Math.abs(newViewWindow[key].additionalMargin);
                        return newViewWindow[key];
                    }),
                    summary: footerData
                };
                resolve(result);
            }, reject);
        });
    }

    public getMarginComponentsLatest(clearer: string = '*', member: string = '*', account: string = '*',
                                     clss: string = '*', ccy: string = '*'): Promise<MarginComponentsRowData[]> {
        return new Promise((resolve, reject) => {
            this.get({
                resourceURL: marginComponentsLatestURL,
                params: [
                    clearer,
                    member,
                    account,
                    clss,
                    ccy
                ]
            }).subscribe((data: MarginComponentsServerData[]) => {
                let result: MarginComponentsRowData[] = [];
                if (data) {
                    data.forEach((record: MarginComponentsServerData) => {
                        let row: MarginComponentsRowData = {
                            clearer: record.clearer,
                            member: record.member,
                            account: record.account,
                            class: record.clss,
                            bizDt: record.bizDt,
                            premiumMargin: record.premiumMargin,
                            received: new Date(record.received),
                            ccy: record.ccy,
                            additionalMargin: record.additionalMargin,
                            liquiMargin: record.liquiMargin,
                            spreadMargin: record.spreadMargin,
                            variationMargin: record.variationMargin
                        };

                        row.variLiqui = record.variationMargin + record.liquiMargin;
                        row.absAdditionalMargin = Math.abs(record.additionalMargin);

                        result.push(row);
                    });
                    resolve(result);
                } else {
                    resolve([]);
                }
            }, reject);
        });
    }

    public getMarginComponentsHistory(clearer: string, member: string, account: string, clss: string, ccy: string): Promise<MarginComponentsRowData[]> {
        return new Promise((resolve, reject) => {
            this.get({
                resourceURL: marginComponentsHistoryURL,
                params: [
                    clearer,
                    member,
                    account,
                    clss,
                    ccy
                ]
            }).subscribe((data: MarginComponentsServerData[]) => {
                let result: MarginComponentsRowData[] = [];
                if (data) {
                    data.forEach((record: MarginComponentsServerData) => {
                        let row: MarginComponentsRowData = {
                            clearer: record.clearer,
                            member: record.member,
                            account: record.account,
                            class: record.clss,
                            bizDt: record.bizDt,
                            premiumMargin: record.premiumMargin,
                            received: new Date(record.received),
                            ccy: record.ccy,
                            additionalMargin: record.additionalMargin,
                            liquiMargin: record.liquiMargin,
                            spreadMargin: record.spreadMargin,
                            variationMargin: record.variationMargin
                        };

                        row.variLiqui = record.variationMargin + record.liquiMargin;

                        result.push(row);
                    });
                    resolve(result);
                } else {
                    resolve([]);
                }
            }, reject);
        });
    }
}