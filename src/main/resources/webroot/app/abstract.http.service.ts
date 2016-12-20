import {Http, RequestOptions, Response, Headers} from '@angular/http';

import {AuthHttp} from 'angular2-jwt';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

export const defaultURL: string = 'https://ttsave.snapshot.dave.dbg-devops.com/api/v1.0'; // 'http(s)://someUrl:port/path'
//export const defaultURL: string = '/api/v1.0'; // 'http(s)://someUrl:port/path'

export interface Request<T> {
    resourceURL: string;
    params?: string[];
    subParams?: string[];

    mapFunction?: (value: any, index: number) => T;
}


export interface PostRequest<T> extends Request<T> {
    data: any;
}

export interface ErrorResponse {
    status: number;
    message: string;
}

export abstract class AbstractHttpService<T> {

    private cache: any = {};

    constructor(private http: Http, private authHttp: AuthHttp) {
    }

    protected constructURL(request: Request<T>): string {
        let resourceURL: string = request.resourceURL;
        let index: number = 0;
        if (request.params) {
            Object.keys(request.params).forEach((key: string) => {
                resourceURL = resourceURL.replace(':' + index, request.params[key]);
                index += 1;
            });
        }
        if (request.subParams) {
            Object.keys(request.subParams).forEach((key: string) => {
                resourceURL = resourceURL.replace(':' + index, request.subParams[key]);
                index += 1;
            });
        }
        return defaultURL + resourceURL;
    }

    private static getRequestOptions(): RequestOptions {
        let headers: Headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        return new RequestOptions({
            headers: headers
        });
    }

    private static extractData(res: Response): any {
        let body: any = res.json();
        return body.data || body;
    }

    private static handleError(error: Response | any): Observable<ErrorResponse> {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string, err: any, body: any;
        if (error.status === 401) {
            // Not logged in - login first
            return Observable.throw({
                status: error.status,
                message: error.statusText
            });
        } else {
            if (error instanceof Response) {
                //noinspection UnusedCatchParameterJS
                try {
                    body = error.json() || '';
                    err = body.error || JSON.stringify(body);
                } catch (e) {
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
                status: error.status || 500,
                message: errMsg
            });
        }
    }

    protected get(request: Request<T>, auth: boolean = true): Observable<T | ErrorResponse> {
        let http: Http | AuthHttp = auth ? this.authHttp : this.http;
        let requestObservable: Observable<T> = http.get(this.constructURL(request), AbstractHttpService.getRequestOptions())
            .map(AbstractHttpService.extractData);
        if (request.mapFunction) {
            requestObservable.map(request.mapFunction);
        }
        return requestObservable.catch(AbstractHttpService.handleError);
    }

    protected post(request: PostRequest<T>, auth: boolean = true): Observable<T | ErrorResponse> {
        let http: Http | AuthHttp = auth ? this.authHttp : this.http;
        let requestObservable: Observable<T> = http.post(this.constructURL(request),
            JSON.stringify(request.data),
            AbstractHttpService.getRequestOptions())
            .map(AbstractHttpService.extractData);
        if (request.mapFunction) {
            requestObservable.map(request.mapFunction);
        }
        return requestObservable.catch(AbstractHttpService.handleError);
    }

    protected getWithCache(request: Request<T>): Promise<T> {
        if (!this.getCache(request)) {
            return new Promise((resolve, reject) => {
                this.get(request).subscribe(
                    (data) => {
                        this.setCache(data, request);
                        resolve(data);
                    }, reject);
            });
        }
        return Promise.resolve(this.getCache(request));
    }

    private getCache(request?: Request<T>): any {
        return this.findCache(request).value;
    }

    protected setCache(data: any, request?: Request<T>): void {
        this.findCache(request).value = data;
    }

    public clearCache(request?: Request<T>): void {
        let cache: any = this.findCache(request);
        Object.keys(cache).forEach((k: string) => {
            delete cache[k];
        });
    }

    private findCache(request?: Request<T>): any {
        let cache: any = this.cache;
        if (request) {
            if (request.params) {
                Object.keys(request.params).forEach((key: string) => {
                    if (!cache[request.params[key]]) {
                        cache[request.params[key]] = {};
                    }
                    cache = cache[request.params[key]];
                });
            }
            if (request.subParams) {
                Object.keys(request.subParams).forEach((key: string) => {
                    if (!cache[request.subParams[key]]) {
                        cache[request.subParams[key]] = {};
                    }
                    cache = cache[request.subParams[key]];
                });
            }
        }
        return cache;
    }
}