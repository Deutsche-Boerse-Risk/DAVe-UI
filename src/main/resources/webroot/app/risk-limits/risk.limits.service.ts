import {Injectable} from '@angular/core';
import {AbstractHttpService} from '../abstract.http.service';
import {Http} from '@angular/http';

import {AuthHttp} from 'angular2-jwt';

import {RiskLimitsServerData, RiskLimitsData} from './risk.limits.types';

const riskLimitsLatestURL: string = '/rl/latest/:0/:1/:2/:3';
const riskLimitsHistoryURL: string = '/rl/history/:0/:1/:2/:3';

@Injectable()
export class RiskLimitsService extends AbstractHttpService<RiskLimitsServerData[]> {

    constructor(http: Http, authHttp: AuthHttp) {
        super(http, authHttp);
    }

    public getRiskLimitsLatest(clearer: string = '*', member: string = '*', maintainer: string = '*',
                               limitType: string = '*'): Promise<RiskLimitsData[]> {
        return new Promise((resolve, reject) => {
            this.get({
                resourceURL: riskLimitsLatestURL,
                params: [
                    clearer,
                    member,
                    maintainer,
                    limitType
                ]
            }).subscribe((data: RiskLimitsServerData[]) => {
                let result: RiskLimitsData[] = [];
                if (data) {
                    data.forEach((record: RiskLimitsServerData) => {
                        let row: RiskLimitsData = {
                            clearer: record.clearer,
                            member: record.member,
                            maintainer: record.maintainer,
                            limitType: record.limitType,
                            utilization: record.utilization,
                            warningLevel: record.warningLevel,
                            throttleLevel: record.throttleLevel,
                            rejectLevel: record.rejectLevel,
                            received: record.received
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

                    resolve(result);
                } else {
                    resolve([]);
                }
            }, reject);
        });
    }

    public getRiskLimitsHistory(clearer: string, member: string, maintainer: string, limitType: string): Promise<RiskLimitsData[]> {
        return new Promise((resolve, reject) => {
            this.get({
                resourceURL: riskLimitsHistoryURL,
                params: [
                    clearer,
                    member,
                    maintainer,
                    limitType
                ]
            }).subscribe((data: RiskLimitsServerData[]) => {
                let result: RiskLimitsData[] = [];
                if (data) {
                    data.forEach((record: RiskLimitsServerData) => {
                        let row: RiskLimitsData = {
                            clearer: record.clearer,
                            member: record.member,
                            maintainer: record.maintainer,
                            limitType: record.limitType,
                            utilization: record.utilization,
                            warningLevel: record.warningLevel,
                            throttleLevel: record.throttleLevel,
                            rejectLevel: record.rejectLevel,
                            received: record.received
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

                    resolve(result);
                } else {
                    resolve([]);
                }
            }, reject);
        });
    }
}