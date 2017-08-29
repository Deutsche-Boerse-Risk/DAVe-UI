import {catchOperator} from '@angular/cdk/rxjs';
import {Injectable} from '@angular/core';

import {mergeMap, Request, RxChain, StrictRxChain} from '@dbg-riskit/dave-ui-common';
import {ErrorCollectorService} from '@dbg-riskit/dave-ui-error';
import {HttpService} from '@dbg-riskit/dave-ui-http';

import {Observable} from 'rxjs/Observable';
import {timer} from 'rxjs/observable/timer';
import {of as observableOf} from 'rxjs/observable/of';

export const DATA_REFRESH_INTERVAL = 60000;

@Injectable()
export class PeriodicHttpService<T> {

    constructor(private http: HttpService<T>, private errorCollector: ErrorCollectorService) {
    }

    public get(request: Request<T>, errorHandler: () => any): StrictRxChain<T> {
        return RxChain.from(timer(0, DATA_REFRESH_INTERVAL)).call(mergeMap, () => {
            return RxChain.from(this.http.get(request))
                .call(catchOperator,
                    (err: any) => {
                        let data = errorHandler();
                        let noData: Observable<T> = this.errorCollector.handleStreamError(err);
                        if (data) {
                            return observableOf(data);
                        } else {
                            return noData;
                        }
                    });
        });
    }

}