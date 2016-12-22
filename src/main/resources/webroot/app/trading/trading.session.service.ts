import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {AuthHttp} from 'angular2-jwt';

import {AbstractHttpService} from '../abstract.http.service';

const url: string = '/tss/latest';

export interface TradingSessionStatus {
    _id: {
        sesId: string;
    };
    id: {
        $oid: string;
    };
    reqId: string;
    sesId: string;
    stat: number;
    statRejRsn: any;
    txt: any;
    received: string;
}

@Injectable()
export class TradingSessionService extends AbstractHttpService<TradingSessionStatus[]> {

    constructor(http: Http, authHttp: AuthHttp) {
        super(http, authHttp);
    }

    public getTradingSessionStatuses(): Promise<TradingSessionStatus[]> {
        return new Promise((resolve, reject) => {
            this.get({resourceURL: url}).subscribe(resolve, reject);
        });
    }

}