import {TestBed, inject} from "@angular/core/testing";
import {Http, RequestOptionsArgs, Response, Headers, ResponseOptions} from "@angular/http";

import {AuthHttp} from "angular2-jwt";

import {Observable} from "rxjs/Observable";

import {HttpService, ErrorResponse, defaultURL} from "./http.service";

describe('HTTPService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                HttpService,
                {provide: Http, useClass: HttpStub},
                {provide: AuthHttp, useClass: HttpStub}
            ]
        });
    });

    it('call get and use auth (no data key in result)', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue({content: 'Some content'});
                let getSpy = spyOn(authHttp, 'get').and.callThrough();

                httpService.get({
                    resourceURL: '/some_url/'
                }).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(getSpy).toHaveBeenCalled();
                        expect(getSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call get and use auth (data key in result)', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue({data: {content: 'Some content'}});
                let getSpy = spyOn(authHttp, 'get').and.callThrough();

                httpService.get({
                    resourceURL: '/some_url/'
                }).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(getSpy).toHaveBeenCalled();
                        expect(getSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call get and don\'t use auth (no data key in result)', (done: DoneFn) => {
        inject([HttpService, Http],
            function (httpService: HttpService<any>, http: HttpStub) {
                http.returnValue({content: 'Some content'});
                let getSpy = spyOn(http, 'get').and.callThrough();

                httpService.get({
                    resourceURL: '/some_url/'
                }, false).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(getSpy).toHaveBeenCalled();
                        expect(getSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call get and don\'t use auth (data key in result)', (done: DoneFn) => {
        inject([HttpService, Http],
            function (httpService: HttpService<any>, http: HttpStub) {
                http.returnValue({data: {content: 'Some content'}});
                let getSpy = spyOn(http, 'get').and.callThrough();

                httpService.get({
                    resourceURL: '/some_url/'
                }, false).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(getSpy).toHaveBeenCalled();
                        expect(getSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call get with map function', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue({data: {content: 'Some content'}});
                let getSpy = spyOn(authHttp, 'get').and.callThrough();

                httpService.get({
                    resourceURL: '/some_url/',
                    mapFunction: (data: any) => {
                        return data.content;
                    }
                }).subscribe(
                    (data: any) => {
                        expect(data).toEqual('Some content');
                        expect(getSpy).toHaveBeenCalled();
                        expect(getSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call get with URL parameters', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue({data: {content: 'Some content'}});
                let getSpy = spyOn(authHttp, 'get').and.callThrough();

                httpService.get({
                    resourceURL: '/some_url/:0/:1',
                    params: ['param1', 'param2']
                }).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(getSpy).toHaveBeenCalled();
                        expect(getSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/param1/param2');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call get with URL sub-parameters', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue({data: {content: 'Some content'}});
                let getSpy = spyOn(authHttp, 'get').and.callThrough();

                httpService.get({
                    resourceURL: '/some_url/:0/:1',
                    subParams: ['param1', 'param2']
                }).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(getSpy).toHaveBeenCalled();
                        expect(getSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/param1/param2');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call get with URL parameters and sub-parameters', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue({data: {content: 'Some content'}});
                let getSpy = spyOn(authHttp, 'get').and.callThrough();

                httpService.get({
                    resourceURL: '/some_url/:0/:1:2_:3',
                    params: ['param1', 'param2'],
                    subParams: ['param3', 'param4']
                }).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(getSpy).toHaveBeenCalled();
                        expect(getSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/param1/param2param3_param4');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call get and return error response 5xx', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnErrorResponse(500, {error: 'Error response'});
                let getSpy = spyOn(authHttp, 'get').and.callThrough();

                httpService.get({
                    resourceURL: '/some_url/'
                }).subscribe(
                    () => {
                        done.fail();
                    },
                    (error: ErrorResponse) => {
                        expect(getSpy).toHaveBeenCalled();
                        expect(getSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');

                        expect(error.status).toBe(500);
                        expect(error.message).toContain('Error response');
                        expect(error.message).toContain('Server error');
                        expect(error.message).toContain('500');
                        done();
                    });
            })()
    });

    it('call get and return error response 5xx (no JSON response data)', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnErrorResponse(500, 'Error response', false);
                let getSpy = spyOn(authHttp, 'get').and.callThrough();

                httpService.get({
                    resourceURL: '/some_url/'
                }).subscribe(
                    () => {
                        done.fail();
                    },
                    (error: ErrorResponse) => {
                        expect(getSpy).toHaveBeenCalled();
                        expect(getSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');

                        expect(error.status).toBe(500);
                        expect(error.message).toContain('Error response');
                        expect(error.message).toContain('Server error');
                        expect(error.message).toContain('500');
                        done();
                    });
            })()
    });

    it('call get and return error response 401 (Unauthorized)', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnErrorResponse(401, {error: 'Unauthorized'});
                let getSpy = spyOn(authHttp, 'get').and.callThrough();
                let unauthorizedSpy = spyOn(httpService.unauthorized, 'emit');

                httpService.get({
                    resourceURL: '/some_url/'
                }).subscribe(
                    () => {
                        done.fail();
                    },
                    (error: ErrorResponse) => {
                        expect(getSpy).toHaveBeenCalled();
                        expect(getSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');

                        expect(unauthorizedSpy).toHaveBeenCalled();
                        expect(unauthorizedSpy.calls.mostRecent().args[0].status).toBe(401);
                        expect(unauthorizedSpy.calls.mostRecent().args[0].message).toBe('Server error');

                        expect(error.status).toBe(401);
                        expect(error.message).toContain('Server error');
                        done();
                    });
            })()
    });

    it('call get and return response with invalid JSON', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue('some invalid data', false);
                let getSpy = spyOn(authHttp, 'get').and.callThrough();

                httpService.get({
                    resourceURL: '/some_url/'
                }).subscribe(
                    () => {
                        done.fail();
                    },
                    (error: ErrorResponse) => {
                        expect(getSpy).toHaveBeenCalled();
                        expect(getSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');

                        expect(error.status).toBe(500);
                        done();
                    });
            })()
    });

    it('call get and throw error inside', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.throwError('some invalid data');
                let getSpy = spyOn(authHttp, 'get').and.callThrough();

                httpService.get({
                    resourceURL: '/some_url/'
                }).subscribe(
                    () => {
                        done.fail();
                    },
                    (error: ErrorResponse) => {
                        expect(getSpy).toHaveBeenCalled();
                        expect(getSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');

                        expect(error.status).toBe(500);
                        expect(error.message).toContain('some invalid data');
                        done();
                    });
            })()
    });

    it('call post and use auth (no data key in result)', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue({content: 'Some content'});
                let postSpy = spyOn(authHttp, 'post').and.callThrough();

                httpService.post({
                    resourceURL: '/some_url/',
                    data: {data: 'Data object'}
                }).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(postSpy).toHaveBeenCalled();
                        expect(postSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call post and use auth (data key in result)', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue({data: {content: 'Some content'}});
                let postSpy = spyOn(authHttp, 'post').and.callThrough();

                httpService.post({
                    resourceURL: '/some_url/',
                    data: {data: 'Data object'}
                }).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(postSpy).toHaveBeenCalled();
                        expect(postSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call post and don\'t use auth (no data key in result)', (done: DoneFn) => {
        inject([HttpService, Http],
            function (httpService: HttpService<any>, http: HttpStub) {
                http.returnValue({content: 'Some content'});
                let postSpy = spyOn(http, 'post').and.callThrough();

                httpService.post({
                    resourceURL: '/some_url/',
                    data: {data: 'Data object'}
                }, false).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(postSpy).toHaveBeenCalled();
                        expect(postSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call post and don\'t use auth (data key in result)', (done: DoneFn) => {
        inject([HttpService, Http],
            function (httpService: HttpService<any>, http: HttpStub) {
                http.returnValue({data: {content: 'Some content'}});
                let postSpy = spyOn(http, 'post').and.callThrough();

                httpService.post({
                    resourceURL: '/some_url/',
                    data: {data: 'Data object'}
                }, false).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(postSpy).toHaveBeenCalled();
                        expect(postSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call post with map function', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue({data: {content: 'Some content'}});
                let postSpy = spyOn(authHttp, 'post').and.callThrough();

                httpService.post({
                    resourceURL: '/some_url/',
                    mapFunction: (data: any) => {
                        return data.content;
                    },
                    data: {data: 'Data object'}
                }).subscribe(
                    (data: any) => {
                        expect(data).toEqual('Some content');
                        expect(postSpy).toHaveBeenCalled();
                        expect(postSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call post with URL parameters', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue({data: {content: 'Some content'}});
                let postSpy = spyOn(authHttp, 'post').and.callThrough();

                httpService.post({
                    resourceURL: '/some_url/:0/:1',
                    params: ['param1', 'param2'],
                    data: {data: 'Data object'}
                }).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(postSpy).toHaveBeenCalled();
                        expect(postSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/param1/param2');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call post with URL sub-parameters', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue({data: {content: 'Some content'}});
                let postSpy = spyOn(authHttp, 'post').and.callThrough();

                httpService.post({
                    resourceURL: '/some_url/:0/:1',
                    subParams: ['param1', 'param2'],
                    data: {data: 'Data object'}
                }).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(postSpy).toHaveBeenCalled();
                        expect(postSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/param1/param2');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call post with URL parameters and sub-parameters', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue({data: {content: 'Some content'}});
                let postSpy = spyOn(authHttp, 'post').and.callThrough();

                httpService.post({
                    resourceURL: '/some_url/:0/:1:2_:3',
                    params: ['param1', 'param2'],
                    subParams: ['param3', 'param4'],
                    data: {data: 'Data object'}
                }).subscribe(
                    (data: any) => {
                        expect(data.content).toEqual('Some content');
                        expect(postSpy).toHaveBeenCalled();
                        expect(postSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/param1/param2param3_param4');
                        done();
                    },
                    () => {
                        done.fail();
                    });
            })()
    });

    it('call post and return error response 5xx', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnErrorResponse(500, {error: 'Error response'});
                let postSpy = spyOn(authHttp, 'post').and.callThrough();

                httpService.post({
                    resourceURL: '/some_url/',
                    data: {data: 'Data object'}
                }).subscribe(
                    () => {
                        done.fail();
                    },
                    (error: ErrorResponse) => {
                        expect(postSpy).toHaveBeenCalled();
                        expect(postSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');

                        expect(error.status).toBe(500);
                        expect(error.message).toContain('Error response');
                        expect(error.message).toContain('Server error');
                        expect(error.message).toContain('500');
                        done();
                    });
            })()
    });

    it('call post and return error response 5xx (no JSON response data)', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnErrorResponse(500, 'Error response', false);
                let postSpy = spyOn(authHttp, 'post').and.callThrough();

                httpService.post({
                    resourceURL: '/some_url/',
                    data: {data: 'Data object'}
                }).subscribe(
                    () => {
                        done.fail();
                    },
                    (error: ErrorResponse) => {
                        expect(postSpy).toHaveBeenCalled();
                        expect(postSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');

                        expect(error.status).toBe(500);
                        expect(error.message).toContain('Error response');
                        expect(error.message).toContain('Server error');
                        expect(error.message).toContain('500');
                        done();
                    });
            })()
    });

    it('call post and return error response 401 (Unauthorized)', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnErrorResponse(401, {error: 'Unauthorized'});
                let postSpy = spyOn(authHttp, 'post').and.callThrough();
                let unauthorizedSpy = spyOn(httpService.unauthorized, 'emit');

                httpService.post({
                    resourceURL: '/some_url/',
                    data: {data: 'Data object'}
                }).subscribe(
                    () => {
                        done.fail();
                    },
                    (error: ErrorResponse) => {
                        expect(postSpy).toHaveBeenCalled();
                        expect(postSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');

                        expect(unauthorizedSpy).toHaveBeenCalled();
                        expect(unauthorizedSpy.calls.mostRecent().args[0].status).toBe(401);
                        expect(unauthorizedSpy.calls.mostRecent().args[0].message).toBe('Server error');

                        expect(error.status).toBe(401);
                        expect(error.message).toContain('Server error');
                        done();
                    });
            })()
    });

    it('call post and return response with invalid JSON', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.returnValue('some invalid data', false);
                let postSpy = spyOn(authHttp, 'post').and.callThrough();

                httpService.post({
                    resourceURL: '/some_url/',
                    data: {data: 'Data object'}
                }).subscribe(
                    () => {
                        done.fail();
                    },
                    (error: ErrorResponse) => {
                        expect(postSpy).toHaveBeenCalled();
                        expect(postSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');

                        expect(error.status).toBe(500);
                        done();
                    });
            })()
    });

    it('call post and throw error inside', (done: DoneFn) => {
        inject([HttpService, AuthHttp],
            function (httpService: HttpService<any>, authHttp: HttpStub) {
                authHttp.throwError('some invalid data');
                let postSpy = spyOn(authHttp, 'post').and.callThrough();

                httpService.post({
                    resourceURL: '/some_url/',
                    data: {data: 'Data object'}
                }).subscribe(
                    () => {
                        done.fail();
                    },
                    (error: ErrorResponse) => {
                        expect(postSpy).toHaveBeenCalled();
                        expect(postSpy.calls.mostRecent().args[0]).toEqual(defaultURL + '/some_url/');

                        expect(error.status).toBe(500);
                        expect(error.message).toContain('some invalid data');
                        done();
                    });
            })()
    });
});

class HttpStub {

    private value: Response[] = [];
    private error: (Response | string)[] = [];

    public returnValue(httpBody: any, stingify: boolean = true) {
        this.value.push(new Response(new ResponseOptions({
            body: stingify ? JSON.stringify(httpBody) : httpBody,
            status: 200,
            headers: new Headers({}),
            url: '/some_url/'
        })));
    }

    public throwError(value: string) {
        this.error.push(value);
    }

    public returnErrorResponse(responseCode: number, errorBody: any, stingify: boolean = true) {
        this.error.push(new Response(new ResponseOptions({
            body: stingify ? JSON.stringify(errorBody) : errorBody,
            status: responseCode,
            statusText: 'Server error',
            headers: new Headers({}),
            url: '/some_url/'
        })));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        if (this.error.length) {
            let error = this.error.shift();
            if (error instanceof Response) {
                return Observable.throw(error);
            } else {
                return Observable.throw(new Error(error));
            }
        }
        let value = this.value.shift();
        return Observable.of(value);
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.get(url, options);
    }
}