import {Injectable, EventEmitter} from '@angular/core';
import {Http, RequestOptions, Response, Headers, URLSearchParams} from '@angular/http';

import {AuthHttp} from 'angular2-jwt';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

export const defaultURL: string = (<any>window).baseRestURL + '/api/v1.0';
export const authURL: string = (<any>window).baseAuthURL;

export const CONTENT_TYPE = {
    APPLICATION_FORM     : 'application/x-www-form-urlencoded',
    APPLICATION_FORM_DATA: 'multipart/form-data',
    APPLICATION_JSON     : 'application/json',
    TEXT_PLAIN           : 'text/plain'
};

export interface Request<T> {
    resourceURL: string;
    params?: any;
    secure?: boolean;
    auth?: boolean;

    mapFunction?: (value: any, index: number) => T;
}

export interface PostRequest<T> extends Request<T> {
    data: FormData | URLSearchParams | string | Object;
    content_type?: string;
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

    private static getRequestOptions<T>(request: Request<T>): RequestOptions {
        let headers: Headers = new Headers();
        headers.append('Accept', CONTENT_TYPE.APPLICATION_JSON);
        if ((request as PostRequest<T>).content_type) {
            headers.append('Content-Type', (request as PostRequest<T>).content_type);
        }
        return new RequestOptions({
            headers: headers,
            params : HttpService.filter(request.params)
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

    public get(request: Request<T>): Observable<T> {
        if (request.secure == null) {
            request.secure = true;
        }
        let http: Http | AuthHttp = request.secure ? this.authHttp : this.http;
        let requestObservable: Observable<T> = http.get((request.auth ? authURL : defaultURL) + request.resourceURL,
            HttpService.getRequestOptions(request))
            .map(HttpService.extractData);
        if (request.mapFunction) {
            requestObservable = requestObservable.map(request.mapFunction);
        }
        return requestObservable.catch(this.handleError.bind(this));
    }

    public post(request: PostRequest<T>): Observable<T> {
        if (request.secure == null) {
            request.secure = true;
        }
        let http: Http | AuthHttp = request.secure ? this.authHttp : this.http;

        if (!request.content_type) {
            if (request.data instanceof URLSearchParams) {
                request.content_type = CONTENT_TYPE.APPLICATION_FORM;
            } else if (request.data instanceof FormData) {
                request.content_type = CONTENT_TYPE.APPLICATION_FORM_DATA;
            } else if (typeof request.data === 'string') {
                request.content_type = CONTENT_TYPE.TEXT_PLAIN;
            } else {
                request.content_type = CONTENT_TYPE.APPLICATION_JSON;
            }
        }

        let requestObservable: Observable<T> = http.post((request.auth ? authURL : defaultURL) + request.resourceURL,
            request.data, HttpService.getRequestOptions(request))
            .map(HttpService.extractData);
        if (request.mapFunction) {
            requestObservable = requestObservable.map(request.mapFunction);
        }
        return requestObservable.catch(this.handleError.bind(this));
    }

    public static toURLSearchParams(data: { [key: string]: string }): URLSearchParams {
        let searchParams = new URLSearchParams();
        Object.keys(data).forEach((key: string) => searchParams.set(key, data[key]));
        return searchParams;
    }

    public static toFormData(data: { [key: string]: any }): FormData {
        let formData = new FormData();
        Object.keys(data).forEach((key: string) => formData.append(key, data[key]));
        return formData;
    }
}