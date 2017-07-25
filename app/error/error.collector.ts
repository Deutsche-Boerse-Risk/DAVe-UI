import {Injectable} from '@angular/core';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {ErrorMessage, ErrorType} from '@dbg-riskit/dave-ui-common';

import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {empty as observableEmpty} from 'rxjs/observable/empty';

@Injectable()
export class ErrorCollectorService {

    private _errorObservable: ReplaySubject<ErrorMessage> = new ReplaySubject(10);

    constructor(authService: AuthService) {
        authService.loggedInChange.subscribe((auth: boolean) => {
            this._errorObservable = new ReplaySubject(10);
        });
    }

    public error(err: ErrorMessage) {
        this._errorObservable.next(err);
    }

    public get errorStream(): Observable<ErrorMessage> {
        return this._errorObservable.asObservable();
    }

    public handleStreamError<T>(err: any): Observable<T> {
        let errorMessage: ErrorMessage;
        if ((err as ErrorMessage).status == null || (err as ErrorMessage).errorType == null || (err as ErrorMessage).message == null) {
            err = err.message || err.toString();
            errorMessage = {
                message  : err,
                status   : 500,
                errorType: ErrorType.ERROR
            };
        } else {
            errorMessage = err;
        }
        this.error(errorMessage);
        return observableEmpty();
    }
}