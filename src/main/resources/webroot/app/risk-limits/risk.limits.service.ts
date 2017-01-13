import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {Observable} from 'rxjs/Observable';

import {RiskLimitsServerData, RiskLimitsData} from './risk.limits.types';

const riskLimitsLatestURL: string = '/rl/latest/:0/:1/:2/:3';
const riskLimitsHistoryURL: string = '/rl/history/:0/:1/:2/:3';

@Injectable()
export class RiskLimitsService {

    constructor(private http: HttpService<RiskLimitsServerData[]>) {
    }

    public getRiskLimitsLatest(clearer: string = '*', member: string = '*', maintainer: string = '*',
                               limitType: string = '*'): Observable<RiskLimitsData[]> {
        return this.http.get({
            resourceURL: riskLimitsLatestURL,
            params: [
                clearer,
                member,
                maintainer,
                limitType
            ]
        }).map((data: RiskLimitsServerData[]) => {
            let result: RiskLimitsData[] = [];
            if (data) {
                data.forEach((record: RiskLimitsServerData) => {
                    let row: RiskLimitsData = {
                        uid: this.computeUID(record),
                        clearer: record.clearer,
                        member: record.member,
                        maintainer: record.maintainer,
                        limitType: record.limitType,
                        utilization: record.utilization,
                        warningLevel: record.warningLevel,
                        throttleLevel: record.throttleLevel,
                        rejectLevel: record.rejectLevel,
                        received: new Date(record.received)
                    };

                    if (record.warningLevel > 0) {
                        row.warningUtil = record.utilization / record.warningLevel * 100;
                    }

                    if (record.throttleLevel > 0) {
                        row.throttleUtil = record.utilization / record.throttleLevel * 100;
                    }

                    if (record.rejectLevel > 0) {
                        row.rejectUtil = record.utilization / record.rejectLevel * 100;
                    }

                    result.push(row);
                });

                return result;
            } else {
                return [];
            }
        });
    }

    public getRiskLimitsHistory(clearer: string, member: string, maintainer: string, limitType: string): Observable<RiskLimitsData[]> {
        return this.http.get({
            resourceURL: riskLimitsHistoryURL,
            params: [
                clearer,
                member,
                maintainer,
                limitType
            ]
        }).map((data: RiskLimitsServerData[]) => {
            let result: RiskLimitsData[] = [];
            if (data) {
                data.forEach((record: RiskLimitsServerData) => {
                    let row: RiskLimitsData = {
                        uid: this.computeUID(record),
                        clearer: record.clearer,
                        member: record.member,
                        maintainer: record.maintainer,
                        limitType: record.limitType,
                        utilization: record.utilization,
                        warningLevel: record.warningLevel,
                        throttleLevel: record.throttleLevel,
                        rejectLevel: record.rejectLevel,
                        received: new Date(record.received)
                    };

                    if (record.warningLevel > 0) {
                        row.warningUtil = record.utilization / record.warningLevel * 100;
                    }

                    if (record.throttleLevel > 0) {
                        row.throttleUtil = record.utilization / record.throttleLevel * 100;
                    }

                    if (record.rejectLevel > 0) {
                        row.rejectUtil = record.utilization / record.rejectLevel * 100;
                    }

                    result.push(row);
                });

                return result;
            } else {
                return [];
            }
        });
    }

    private computeUID(data: RiskLimitsServerData): string {
        return Object.keys(data._id).sort().map((key: string) => {
            let value: any = (<any>data._id)[key];
            if (!value) {
                return '';
            }
            return value.toString().replace('\.', '');
        }).join('-');
    }
}