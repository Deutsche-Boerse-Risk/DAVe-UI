import {EventEmitter} from "@angular/core";

import {ErrorResponse, Request, PostRequest} from "../app/http.service";

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class HttpServiceStub<T> {

    private value: any[] = [];
    private error: ErrorResponse[] = [];

    public unauthorized: EventEmitter<ErrorResponse> = new EventEmitter();

    public returnValue(value: any) {
        this.value.push(value);
    }

    public throwError(value: ErrorResponse) {
        this.error.push(value);
    }

    public get(request: Request<T>, auth: boolean = true): Observable<T> {
        if (this.error.length) {
            let error = this.error.shift();
            return Observable.throw(error);
        }
        let value = this.value.shift();
        return Observable.of(value);
    }

    public post(request: PostRequest<T>, auth: boolean = true): Observable<T> {
        return this.get(request, auth);
    }
}