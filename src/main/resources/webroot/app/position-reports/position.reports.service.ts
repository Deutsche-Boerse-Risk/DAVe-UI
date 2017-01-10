import {Injectable} from '@angular/core';
import {AbstractHttpService} from '../abstract.http.service';
import {Http} from '@angular/http';

import {AuthHttp} from 'angular2-jwt';

import {PositionReportServerData, PositionReportChartData, PositionReportData} from './position.report.types';

const chartsURL: string = '/pr/latest';
const latestURL: string = '/pr/latest/:0/:1/:2/:3/:4/:5/:6/:7/:8';
const historyURL: string = '/pr/history/:0/:1/:2/:3/:4/:5/:6/:7/:8';

@Injectable()
export class PositionReportsService extends AbstractHttpService<PositionReportServerData[]> {

    constructor(http: Http, authHttp: AuthHttp) {
        super(http, authHttp);
    }

    public getPositionReportsChartData(): Promise<PositionReportChartData[]> {
        return new Promise((resolve, reject) => {
            this.get({resourceURL: chartsURL}).subscribe(resolve, reject);
        });
    }

    public getPositionReportLatest(clearer: string = '*', member: string = '*', account: string = '*',
                                   clss: string = '*', symbol: string = '*', putCall: string = '*',
                                   strikePrice: string = '*', optAttribute: string = '*',
                                   maturityMonthYear: string = '*'): Promise<PositionReportData[]> {
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
            }).subscribe((data: PositionReportServerData[]) => {
                let result: PositionReportData[] = [];
                if (data) {
                    data.forEach((record: PositionReportServerData) => {
                        let row: PositionReportData = {
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
                    resolve(result);
                } else {
                    resolve([]);
                }
            }, reject);
        });
    }

    public getPositionReportHistory(clearer: string, member: string, account: string,
                                    clss: string, symbol: string, putCall: string,
                                    strikePrice: string, optAttribute: string,
                                    maturityMonthYear: string): Promise<PositionReportData[]> {
        return new Promise((resolve, reject) => {
            this.get({
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
            }).subscribe((data: PositionReportServerData[]) => {
                let result: PositionReportData[] = [];
                if (data) {
                    data.forEach((record: PositionReportServerData) => {
                        let row: PositionReportData = {
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
                    resolve(result);
                } else {
                    resolve([]);
                }
            }, reject);
        });
    }
}