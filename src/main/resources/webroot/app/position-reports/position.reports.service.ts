import {Injectable} from "@angular/core";
import {AbstractHttpService} from "../abstract.http.service";
import {Http} from "@angular/http";

import {AuthHttp} from "angular2-jwt";

import {PositionReportChartData} from "./position.report.chart.data";

const chartsURL: string = '/pr/latest/';

@Injectable()
export class PositionReportsService extends AbstractHttpService<any> {

    constructor(http: Http, authHttp: AuthHttp) {
        super(http, authHttp);
    }

    public getPositionReportsChartData(): Promise<PositionReportChartData[]> {
        return new Promise((resolve, reject) => {
            this.get({resourceURL: chartsURL}).subscribe(resolve, reject);
        });
    }
}