import {Injectable} from '@angular/core';

import {mergeMap, Request, RxChain, StrictRxChain} from '@dbg-riskit/dave-ui-common';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {timer} from 'rxjs/observable/timer';

export const DATA_REFRESH_INTERVAL = 60000;

@Injectable()
export class PeriodicHttpService<T> {

    constructor(private http: HttpService<T>) {
    }

    public get(request: Request<T>): StrictRxChain<T> {
        return RxChain.from(timer(0, DATA_REFRESH_INTERVAL)).call(mergeMap, () => this.http.get(request));
    }

}