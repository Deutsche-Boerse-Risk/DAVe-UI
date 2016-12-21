import {Injectable} from "@angular/core";
import {AbstractHttpService} from "../abstract.http.service";
import {Http} from "@angular/http";

import {AuthHttp} from "angular2-jwt";

import {MarginShortfallSurplus} from "./margin.types";

const marginShortfallSurplusURL: string = '/mss/latest/';

@Injectable()
export class MarginService extends AbstractHttpService<any> {

    constructor(http: Http, authHttp: AuthHttp) {
        super(http, authHttp);
    }

    public getMarginShortfallSurplusData(): Promise<MarginShortfallSurplus[]> {
        return new Promise((resolve, reject) => {
            this.get({resourceURL: marginShortfallSurplusURL}).subscribe(resolve, reject);
        });
    }
}