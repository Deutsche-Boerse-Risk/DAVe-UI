import {Injectable} from '@angular/core';
import {AbstractHttpService} from '../abstract.http.service';
import {Http} from '@angular/http';

import {AuthHttp} from 'angular2-jwt';

import {TotalMarginServerData, TotalMarginData} from './total.margin.types';

const totalMarginLatestURL: string = '/tmr/latest/:0/:1/:2/:3/:4';
const totalMarginHistoryURL: string = '/tmr/history/:0/:1/:2/:3/:4';

@Injectable()
export class TotalMarginService extends AbstractHttpService<TotalMarginServerData[]> {

    constructor(http: Http, authHttp: AuthHttp) {
        super(http, authHttp);
    }

    public getTotalMarginLatest(clearer: string = '*', pool: string = '*', member: string = '*', account: string = '*',
                                ccy: string = '*'): Promise<TotalMarginData[]> {
        return new Promise((resolve, reject) => {
            this.get({
                resourceURL: totalMarginLatestURL,
                params: [
                    clearer,
                    pool,
                    member,
                    account,
                    ccy
                ]
            }).subscribe((data: TotalMarginServerData[]) => {
                let result: TotalMarginData[] = [];
                if (data) {
                    data.forEach((record: TotalMarginServerData) => {
                        let row: TotalMarginData = {
                            clearer: record.clearer,
                            member: record.member,
                            account: record.account,
                            bizDt: record.bizDt,
                            received: record.received,
                            ccy: record.ccy,
                            adjustedMargin: record.adjustedMargin,
                            unadjustedMargin: record.unadjustedMargin,
                            pool: record.pool
                        };

                        result.push(row);
                    });
                    resolve(result);
                } else {
                    resolve([]);
                }
            }, reject);
        });
    }

    public getTotalMarginHistory(clearer: string, pool: string, member: string, account: string,
                                 ccy: string): Promise<TotalMarginData[]> {
        return new Promise((resolve, reject) => {
            this.get({
                resourceURL: totalMarginHistoryURL,
                params: [
                    clearer,
                    pool,
                    member,
                    account,
                    ccy
                ]
            }).subscribe((data: TotalMarginServerData[]) => {
                let result: TotalMarginData[] = [];
                if (data) {
                    data.forEach((record: TotalMarginServerData) => {
                        let row: TotalMarginData = {
                            clearer: record.clearer,
                            member: record.member,
                            account: record.account,
                            bizDt: record.bizDt,
                            received: record.received,
                            ccy: record.ccy,
                            adjustedMargin: record.adjustedMargin,
                            unadjustedMargin: record.unadjustedMargin,
                            pool: record.pool
                        };

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