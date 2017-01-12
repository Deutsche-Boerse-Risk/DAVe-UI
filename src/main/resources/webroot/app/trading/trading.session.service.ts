import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {Observable} from 'rxjs/Observable';

const url: string = '/tss/latest';

interface TradingSessionStatusServerData {
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

export interface TradingSession {
    status: number;
}

@Injectable()
export class TradingSessionService {

    constructor(private http: HttpService<TradingSessionStatusServerData[]>) {
    }

    public getTradingSessionStatuses(): Observable<TradingSession> {
        return this.http.get({resourceURL: url}).map((tss: TradingSessionStatusServerData[]) => {
            if (tss && tss.length) {
                return {
                    status: tss[0].stat
                };
            }
            return {
                status: -1
            }
        });
    }

}