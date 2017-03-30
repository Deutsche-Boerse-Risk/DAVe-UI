import {Injectable, EventEmitter} from '@angular/core';
import {Http, RequestOptions, Response, Headers} from '@angular/http';

import {AuthHttp} from 'angular2-jwt';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

export const defaultURL: string = (<any>window).baseRestURL + '/api/v1.0';

export interface Request<T> {
    resourceURL: string;
    params?: any;

    mapFunction?: (value: any, index: number) => T;
}

export interface PostRequest<T> extends Request<T> {
    data: any;
}

export interface ErrorResponse {
    status: number;
    message: string;
}

@Injectable()
export class HttpService<T> {

    public unauthorized: EventEmitter<ErrorResponse> = new EventEmitter();

    constructor(private http: Http, private authHttp: AuthHttp) {
    }

    private static getRequestOptions(params: any): RequestOptions {
        let headers: Headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        return new RequestOptions({
            headers: headers,
            params : HttpService.filter(params)
        });
    }

    private static filter(params: any): any {
        if (!params) {
            return;
        }
        Object.keys(params).forEach((key: string) => {
            if (params[key] === '*') {
                delete params[key];
            }
        });
        return params;
    }

    private static extractData(res: Response): any {
        let body: any = res.json();
        return body.data || body;
    }

    private handleError(error: Response | any): Observable<any> {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string, err: any, body: any;
        if (error.status === 401) {
            // Not logged in - login first
            this.unauthorized.emit({
                status : error.status,
                message: error.statusText
            });
            return Observable.throw({
                status : error.status,
                message: error.statusText
            });
        } else {
            if (error instanceof Response) {
                try {
                    body = error.json() || '';
                    err = body.error || JSON.stringify(body);
                } catch (ignored) {
                    err = error.text();
                }
                errMsg = error.status + ' - ' + (error.statusText || '') + ' ' + err;
            } else {
                errMsg = error.message || error.toString();
            }
            if (window.console) {
                window.console.error(errMsg);
            }
            return Observable.throw({
                status : error.status || 500,
                message: errMsg
            });
        }
    }

    public get(request: Request<T>, auth: boolean = true): Observable<T> {
        let http: Http | AuthHttp = auth ? this.authHttp : this.http;
        let requestObservable: Observable<T> = http.get(defaultURL + request.resourceURL,
            HttpService.getRequestOptions(request.params))
            .map(HttpService.extractData);
        if (request.mapFunction) {
            requestObservable = requestObservable.map(request.mapFunction);
        }
        return requestObservable.catch(this.handleError.bind(this));
    }

    public post(request: PostRequest<T>, auth: boolean = true): Observable<T> {
        let http: Http | AuthHttp = auth ? this.authHttp : this.http;
        let requestObservable: Observable<T> = http.post(defaultURL + request.resourceURL, JSON.stringify(request.data),
            HttpService.getRequestOptions(request.params))
            .map(HttpService.extractData);
        if (request.mapFunction) {
            requestObservable = requestObservable.map(request.mapFunction);
        }
        return requestObservable.catch(this.handleError.bind(this));
    }
}