import {Injectable} from "@angular/core";

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ActivatedRouteStub {

    // Test parameters
    private _testParams: {} = {};

    // ActivatedRoute.params is Observable
    private subject = new BehaviorSubject(this.testParams);
    params = this.subject.asObservable();

    get testParams() {
        return this._testParams;
    }

    set testParams(params: {}) {
        this._testParams = params;
        this.subject.next(params);
    }

    // ActivatedRoute.snapshot.params
    get snapshot() {
        return {params: this.testParams};
    }
}
