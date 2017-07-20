import {Injectable} from '@angular/core';

import {ErrorResponse} from '@dbg-riskit/dave-ui-common';

import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {empty as observableEmpty} from 'rxjs/observable/empty';

@Injectable()
export class ErrorCollectorService {

    private _errorObservable: ReplaySubject<ErrorResponse> = new ReplaySubject(10);

    public error(err: ErrorResponse) {
        this._errorObservable.next(err);
    }

    public get errorStream(): Observable<ErrorResponse> {
        return this._errorObservable.asObservable();
    }

    public handleStreamError<T>(err: any): Observable<T> {
        if (!(err as ErrorResponse).status || !(err as ErrorResponse).message) {
            err = err.message || err.toString();
            err = {
                message: err,
                status : 500
            };
        }
        this.error(err);
        return observableEmpty();
    }
}