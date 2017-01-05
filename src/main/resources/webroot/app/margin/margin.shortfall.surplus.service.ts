import {Injectable} from '@angular/core';
import {AbstractHttpService} from '../abstract.http.service';
import {Http} from '@angular/http';

import {AuthHttp} from 'angular2-jwt';

import {
    MarginShortfallServerSurplus, MarginShortfallSurplus
} from './margin.types';

const marginShortfallSurplusURL: string = '/mss/latest';

@Injectable()
export class MarginShortfallSurplusService extends AbstractHttpService<MarginShortfallServerSurplus[]> {

    constructor(http: Http, authHttp: AuthHttp) {
        super(http, authHttp);
    }

    public getMarginShortfallSurplusData(): Promise<MarginShortfallSurplus> {
        return new Promise((resolve, reject) => {
            this.get({resourceURL: marginShortfallSurplusURL}).subscribe((data: MarginShortfallServerSurplus[]) => {
                if (!data) {
                    resolve({});
                    return;
                }
                let result: MarginShortfallSurplus = {
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
                resolve(result);
            }, reject);
        });
    }
}