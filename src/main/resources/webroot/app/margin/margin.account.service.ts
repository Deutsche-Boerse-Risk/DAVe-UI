import {Injectable} from '@angular/core';
import {AbstractHttpService} from '../abstract.http.service';
import {Http} from '@angular/http';

import {AuthHttp} from 'angular2-jwt';

import {
    MarginAccountAggregationData,
    MarginAccountServerData,
    MarginAccountDataBase, MarginAccountExportData
} from './margin.types';

const marginAccountAggregationURL: string = '/mc/latest/';
const marginLatestURL: string = '/mc/latest/:0/:1/:2/:3/:4';

@Injectable()
export class MarginAccountService extends AbstractHttpService<MarginAccountServerData[]> {

    constructor(http: Http, authHttp: AuthHttp) {
        super(http, authHttp);
    }

    public getMarginAccountAggregationData(): Promise<MarginAccountAggregationData> {
        return new Promise((resolve, reject) => {
            this.get({resourceURL: marginAccountAggregationURL}).subscribe((data: MarginAccountServerData[]) => {
                if (!data) {
                    resolve({});
                    return;
                }
                let newViewWindow: {[key: string]: MarginAccountDataBase} = {};
                let footerData: MarginAccountDataBase = {
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
                        let cellData: MarginAccountDataBase = newViewWindow[fKey];
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

                let result: MarginAccountAggregationData = {
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

    public getMarginLatest(clearer: string = '*', member: string = '*', account: string = '*',
                           clss: string = '*', ccy: string = '*'): Promise<MarginAccountExportData[]> {
        return new Promise((resolve, reject) => {
            this.get({
                resourceURL: marginLatestURL,
                params: [
                    clearer,
                    member,
                    account,
                    clss,
                    ccy
                ]
            }).subscribe((data: MarginAccountServerData[]) => {
                let result: MarginAccountExportData[] = [];
                if (data) {
                    data.forEach((record: MarginAccountServerData) => {
                        let row: MarginAccountExportData = {
                            clearer: record.clearer,
                            member: record.member,
                            account: record.account,
                            class: record.clss,
                            bizDt: record.bizDt,
                            premiumMargin: record.premiumMargin,
                            received: record.received,
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
}