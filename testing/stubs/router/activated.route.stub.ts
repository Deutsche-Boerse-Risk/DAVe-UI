import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ActivatedRouteStub<T> {

    // Test parameters
    private _testParams: T = <T>{};

    // ActivatedRoute.params is Observable
    private subject = new BehaviorSubject(this.testParams);
    params = this.subject.asObservable();

    get testParams() {
        return this._testParams;
    }

    set testParams(params: T) {
        this._testParams = params;
        this.subject.next(params);
    }

    // ActivatedRoute.snapshot.params
    get snapshot() {
        return {params: this.testParams};
    }
}
