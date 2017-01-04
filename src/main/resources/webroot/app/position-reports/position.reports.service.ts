import {Injectable} from "@angular/core";
import {AbstractHttpService} from "../abstract.http.service";
import {Http} from "@angular/http";

import {AuthHttp} from "angular2-jwt";

import {PositionReportRow} from "./position.report.types";

const chartsURL: string = '/pr/latest';
const latestURL: string = '/pr/latest/:0/:1/:2/:3/:4/:5/:6/:7/:8';

@Injectable()
export class PositionReportsService extends AbstractHttpService<PositionReportRow[]> {

    constructor(http: Http, authHttp: AuthHttp) {
        super(http, authHttp);
    }

    public getPositionReportsChartData(): Promise<PositionReportRow[]> {
        return new Promise((resolve, reject) => {
            this.get({resourceURL: chartsURL}).subscribe(resolve, reject);
        });
    }

    public getPositionReportLatest(clearer: string = '*', member: string = '*', account: string = '*',
                                   clss: string = '*', symbol: string = '*', putCall: string = '*',
                                   strikePrice: string = '*', optAttribute: string = '*',
                                   maturityMonthYear: string = '*'): Promise<PositionReportRow[]> {
        return new Promise((resolve, reject) => {
            this.get({
                resourceURL: latestURL,
                params: [
                    clearer,
                    member,
                    account,
                    clss,
                    symbol,
                    putCall,
                    strikePrice,
                    optAttribute,
                    maturityMonthYear
                ]
            }).subscribe(resolve, reject);
        });
    }
}