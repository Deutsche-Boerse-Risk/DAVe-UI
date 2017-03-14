import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {Observable} from 'rxjs/Observable';
import {UIDUtils} from '../uid.utils';

import {
    MarginShortfallSurplusServerData, MarginShortfallSurplusBase, MarginShortfallSurplusData
} from './margin.types';

export const marginShortfallSurplusURL: string = '/mss/latest';
export const marginShortfallSurplusLatestURL: string = '/mss/latest/:0/:1/:2/:3';
export const marginShortfallSurplusHistoryURL: string = '/mss/history/:0/:1/:2/:3/:4';

@Injectable()
export class MarginShortfallSurplusService {

    constructor(private http: HttpService<MarginShortfallSurplusServerData[]>) {
    }

    public getMarginShortfallSurplusData(): Observable<MarginShortfallSurplusBase> {
        return this.http.get({resourceURL: marginShortfallSurplusURL}).map(
            (data: MarginShortfallSurplusServerData[]) => {
                if (!data) {
                    return {};
                }
                let result: MarginShortfallSurplusBase = {
                    uid: null,
                    shortfallSurplus: 0,
                    marginRequirement: 0,
                    securityCollateral: 0,
                    cashBalance: 0,
                    marginCall: 0,
                };

                for (let index = 0; index < data.length; ++index) {
                    result.shortfallSurplus += data[index].shortfallSurplus;
                    result.marginRequirement += data[index].marginRequirement;
                    result.securityCollateral += data[index].securityCollateral;
                    result.cashBalance += data[index].cashBalance;
                    result.marginCall += data[index].marginCall;
                }
                return result;
            });
    }

    public getShortfallSurplusLatest(clearer: string = '*', pool: string = '*', member: string = '*',
                                     clearingCcy: string = '*'): Observable<MarginShortfallSurplusData[]> {
        return this.http.get({
            resourceURL: marginShortfallSurplusLatestURL,
            params: [
                clearer,
                pool,
                member,
                clearingCcy
            ]
        }).map(MarginShortfallSurplusService.processShortfallSurplusData);
    }

    public getShortfallSurplusHistory(clearer: string, pool: string, member: string, clearingCcy: string,
                                      ccy: string): Observable<MarginShortfallSurplusData[]> {
        return this.http.get({
            resourceURL: marginShortfallSurplusHistoryURL,
            params: [
                clearer,
                pool,
                member,
                clearingCcy,
                ccy
            ]
        }).map(MarginShortfallSurplusService.processShortfallSurplusData);
    }

    private static processShortfallSurplusData(data: MarginShortfallSurplusServerData[]): MarginShortfallSurplusData[] {
        let result: MarginShortfallSurplusData[] = [];
        if (data) {
            data.forEach((record: MarginShortfallSurplusServerData) => {
                let row: MarginShortfallSurplusData = {
                    uid: UIDUtils.computeUID(record),
                    clearer: record.clearer,
                    member: record.member,
                    bizDt: record.bizDt,
                    received: new Date(record.received),
                    ccy: record.ccy,
                    cashBalance: record.cashBalance,
                    clearingCcy: record.clearingCcy,
                    marginCall: record.marginCall,
                    marginRequirement: record.marginRequirement,
                    pool: record.pool,
                    poolType: record.poolType,
                    shortfallSurplus: record.shortfallSurplus,
                    securityCollateral: record.securityCollateral
                };

                result.push(row);
            });
            return result;
        } else {
            return [];
        }
    }
}