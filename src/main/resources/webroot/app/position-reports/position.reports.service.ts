import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {Observable} from 'rxjs/Observable';

import {PositionReportServerData, PositionReportChartData, PositionReportData} from './position.report.types';

const chartsURL: string = '/pr/latest';
const latestURL: string = '/pr/latest/:0/:1/:2/:3/:4/:5/:6/:7/:8';
const historyURL: string = '/pr/history/:0/:1/:2/:3/:4/:5/:6/:7/:8';

@Injectable()
export class PositionReportsService {

    constructor(private http: HttpService<PositionReportServerData[]>) {
    }

    public getPositionReportsChartData(): Observable<PositionReportChartData[]> {
        return this.http.get({resourceURL: chartsURL}).map((data: PositionReportServerData[]) => {
            let chartRecords: PositionReportChartData[] = [];
            if (data) {
                data.forEach((record: PositionReportServerData) => {
                    chartRecords.push({
                        uid: this.computeUID(record),
                        clearer: record.clearer,
                        member: record.member,
                        account: record.account,
                        symbol: record.symbol,
                        putCall: record.putCall,
                        maturityMonthYear: record.maturityMonthYear,
                        compVar: record.compVar,
                        underlying: record.underlying
                    });
                });
            }
            return chartRecords;
        });
    }

    public getPositionReportLatest(clearer: string = '*', member: string = '*', account: string = '*',
                                   clss: string = '*', symbol: string = '*', putCall: string = '*',
                                   strikePrice: string = '*', optAttribute: string = '*',
                                   maturityMonthYear: string = '*'): Observable<PositionReportData[]> {
        return this.http.get({
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
        }).map((data: PositionReportServerData[]) => {
            let result: PositionReportData[] = [];
            if (data) {
                data.forEach((record: PositionReportServerData) => {
                    let row: PositionReportData = {
                        uid: this.computeUID(record),
                        clearer: record.clearer,
                        member: record.member,
                        account: record.account,
                        class: record.clss,
                        symbol: record.symbol,
                        putCall: record.putCall,
                        maturityMonthYear: record.maturityMonthYear,
                        optAttribute: record.optAttribute,
                        compLiquidityAddOn: record.compLiquidityAddOn,
                        delta: record.delta,
                        bizDt: record.bizDt,
                        crossMarginLongQty: record.crossMarginLongQty,
                        crossMarginShortQty: record.crossMarginShortQty,
                        optionExcerciseQty: record.optionExcerciseQty,
                        optionAssignmentQty: record.optionAssignmentQty,
                        allocationTradeQty: record.allocationTradeQty,
                        deliveryNoticeQty: record.deliveryNoticeQty,
                        clearingCcy: record.clearingCcy,
                        mVar: record.mVar,
                        compVar: record.compVar,
                        compCorrelationBreak: record.compCorrelationBreak,
                        compCompressionError: record.compCompressionError,
                        compLongOptionCredit: record.compLongOptionCredit,
                        productCcy: record.productCcy,
                        variationMarginPremiumPayment: record.variationMarginPremiumPayment,
                        premiumMargin: record.premiumMargin,
                        gamma: record.gamma,
                        vega: record.vega,
                        rho: record.rho,
                        theta: record.theta,
                        underlying: record.underlying,
                        received: new Date(record.received)
                    };
                    row.netLS = record.crossMarginLongQty - record.crossMarginShortQty;
                    row.netEA = (record.optionExcerciseQty - record.optionAssignmentQty) + (record.allocationTradeQty - record.deliveryNoticeQty);
                    row.absCompVar = Math.abs(record.compVar);

                    if (record.strikePrice) {
                        row.strikePrice = parseFloat(record.strikePrice);
                    }
                    result.push(row);
                });
                return result;
            } else {
                return [];
            }
        });
    }

    public getPositionReportHistory(clearer: string, member: string, account: string,
                                    clss: string, symbol: string, putCall: string,
                                    strikePrice: string, optAttribute: string,
                                    maturityMonthYear: string): Observable<PositionReportData[]> {
        return this.http.get({
            resourceURL: historyURL,
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
        }).map((data: PositionReportServerData[]) => {
            let result: PositionReportData[] = [];
            if (data) {
                data.forEach((record: PositionReportServerData) => {
                    let row: PositionReportData = {
                        uid: this.computeUID(record),
                        clearer: record.clearer,
                        member: record.member,
                        account: record.account,
                        class: record.clss,
                        symbol: record.symbol,
                        putCall: record.putCall,
                        maturityMonthYear: record.maturityMonthYear,
                        optAttribute: record.optAttribute,
                        compLiquidityAddOn: record.compLiquidityAddOn,
                        delta: record.delta,
                        bizDt: record.bizDt,
                        crossMarginLongQty: record.crossMarginLongQty,
                        crossMarginShortQty: record.crossMarginShortQty,
                        optionExcerciseQty: record.optionExcerciseQty,
                        optionAssignmentQty: record.optionAssignmentQty,
                        allocationTradeQty: record.allocationTradeQty,
                        deliveryNoticeQty: record.deliveryNoticeQty,
                        clearingCcy: record.clearingCcy,
                        mVar: record.mVar,
                        compVar: record.compVar,
                        compCorrelationBreak: record.compCorrelationBreak,
                        compCompressionError: record.compCompressionError,
                        compLongOptionCredit: record.compLongOptionCredit,
                        productCcy: record.productCcy,
                        variationMarginPremiumPayment: record.variationMarginPremiumPayment,
                        premiumMargin: record.premiumMargin,
                        gamma: record.gamma,
                        vega: record.vega,
                        rho: record.rho,
                        theta: record.theta,
                        underlying: record.underlying,
                        received: new Date(record.received)
                    };
                    row.netLS = record.crossMarginLongQty - record.crossMarginShortQty;
                    row.netEA = (record.optionExcerciseQty - record.optionAssignmentQty) + (record.allocationTradeQty - record.deliveryNoticeQty);

                    result.push(row);
                });
                return result;
            } else {
                return [];
            }
        });
    }

    private computeUID(data: PositionReportServerData): string {
        if (data._id) {
            return Object.keys(data._id).sort().map((key: string) => {
                let value: any = (<any>data._id)[key];
                if (!value) {
                    return '';
                }
                return value.toString().replace('\.', '');
            }).join('-');
        } else if (data.id && data.id.$oid) {
            return data.id.$oid;
        }
        return null;
    }
}