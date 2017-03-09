import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {Observable} from 'rxjs/Observable';
import {UIDUtils} from '../uid.utils';

import {TotalMarginServerData, TotalMarginData} from './total.margin.types';

const totalMarginLatestURL: string = '/tmr/latest/:0/:1/:2/:3/:4';
const totalMarginHistoryURL: string = '/tmr/history/:0/:1/:2/:3/:4';

@Injectable()
export class TotalMarginService {

    constructor(private http: HttpService<TotalMarginServerData[]>) {
    }

    public getTotalMarginLatest(clearer: string = '*', pool: string = '*', member: string = '*', account: string = '*',
                                ccy: string = '*'): Observable<TotalMarginData[]> {
        return this.loadTotalMarginData(totalMarginLatestURL, clearer, pool, member, account, ccy);
    }

    public getTotalMarginHistory(clearer: string, pool: string, member: string, account: string,
                                 ccy: string): Observable<TotalMarginData[]> {
        return this.loadTotalMarginData(totalMarginHistoryURL, clearer, pool, member, account, ccy);
    }

    private loadTotalMarginData(url: string, clearer: string, pool: string, member: string, account: string,
                                ccy: string): Observable<TotalMarginData[]> {
        return this.http.get({
            resourceURL: url,
            params: [
                clearer,
                pool,
                member,
                account,
                ccy
            ]
        }).map((data: TotalMarginServerData[]) => {
            let result: TotalMarginData[] = [];
            if (data) {
                data.forEach((record: TotalMarginServerData) => {
                    let row: TotalMarginData = {
                        uid: UIDUtils.computeUID(record),
                        clearer: record.clearer,
                        member: record.member,
                        account: record.account,
                        bizDt: record.bizDt,
                        received: new Date(record.received),
                        ccy: record.ccy,
                        adjustedMargin: record.adjustedMargin,
                        unadjustedMargin: record.unadjustedMargin,
                        pool: record.pool
                    };

                    result.push(row);
                });
                return result;
            } else {
                return [];
            }
        });
    }
}