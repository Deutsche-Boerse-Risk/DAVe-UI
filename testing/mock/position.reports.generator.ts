import {PositionReportServerData} from "../../app/position-reports/position.report.types";
import {UIDUtils} from "../../app/uid.utils";

const ALPHABET = 'ABCDEFGHIJKLMNOQPRSTUVWXYZ0123456789';
const CURRENCIES = ['EUR', 'CZK', 'CHF'];
const UNDERLYINGS = ['ABC', 'BCD', 'DEF', 'ZWY', 'FRP', 'TRS'];

export function generatePositionReports(clearers: number = 3, members: number = 3, accounts: number = 3,
                                        classes: number = 3, symbols: number = 3, putCalls: number = 3,
                                        strikePrices: number = 3, maturityMonthYears: number = 3,
                                        optAttributes: number = 3): PositionReportServerData[] {
    let data: PositionReportServerData[] = [];

    for (let i = 0; i < clearers; i++) {
        for (let j = 0; j < members; j++) {
            for (let k = 0; k < accounts; k++) {
                for (let l = 0; l < classes; l++) {
                    for (let m = 0; m < symbols; m++) {
                        for (let n = 0; n < putCalls; n++) {
                            for (let o = 0; o < strikePrices; o++) {
                                for (let p = 0; p < maturityMonthYears; p++) {
                                    for (let r = 0; r < optAttributes; r++) {
                                        let id = {
                                            _id: {
                                                clearer: ALPHABET.charAt(i % ALPHABET.length),
                                                member: ALPHABET.charAt(j % ALPHABET.length),
                                                account: ALPHABET.charAt(k % ALPHABET.length),
                                                clss: ALPHABET.charAt(l % ALPHABET.length),
                                                symbol: ALPHABET.charAt(m % ALPHABET.length),
                                                putCall: n % 2 === 0 ? 'P' : 'C',
                                                strikePrice: o + '',
                                                maturityMonthYear: p + '',
                                                optAttribute: r + ''
                                            }
                                        };

                                        data.push({
                                            ...id,
                                            ...id._id,
                                            id: {
                                                $oid: UIDUtils.computeUID(id)
                                            },
                                            clearingCcy: CURRENCIES[i * k * m * o * r % CURRENCIES.length],
                                            productCcy: CURRENCIES[j * l * n * p % CURRENCIES.length],
                                            crossMarginLongQty: i * k % 2 === 0 ? j * l : 0,
                                            crossMarginShortQty: m * i % 2 === 0 ? n * p : 0,
                                            mVar: (i * n % 2 === 0 ? -1 : 1) * r * l / (m || 1),
                                            compVar: (m * n % 2 === 0 ? -1 : 1) * o * p / (k || 1),
                                            compCorrelationBreak: (k * p % 2 === 0 ? -1 : 1) * m * r / (j || 1),
                                            compCompressionError: (i * r % 2 === 0 ? -1 : 1) * n * l / (o || 1),
                                            compLiquidityAddOn: (j * n % 2 === 0 ? -1 : 1) * o * i / (l || 1),
                                            compLongOptionCredit: (o * k % 2 === 0 ? -1 : 1) * p * n / (r || 1),
                                            variationMarginPremiumPayment: (o * r % 2 === 0 ? -1 : 1) * r * l / (k || 1),
                                            premiumMargin: (i * n % 2 === 0 ? -1 : 1) * m * p / (r || 1),
                                            delta: (m * n % 2 === 0 ? -1 : 1) * i * n / (m || 1),
                                            gamma: (j * k % 2 === 0 ? -1 : 1) * l * j / (n || 1),
                                            vega: (r * i % 2 === 0 ? -1 : 1) * o * i / (p || 1),
                                            rho: (o * m % 2 === 0 ? -1 : 1) * p * n / (l || 1),
                                            theta: (k * r % 2 === 0 ? -1 : 1) * n * p / (i || 1),
                                            underlying: UNDERLYINGS[i * k * m * o * r % UNDERLYINGS.length],
                                            //Not changing
                                            reqId: null,
                                            bizDt: "2016-11-22",
                                            rptId: "13198434645154",
                                            lastReportRequested: null,
                                            sesId: null,
                                            received: "2016-11-22T11:00:00.000Z",
                                            optionExcerciseQty: 0,
                                            optionAssignmentQty: 0,
                                            allocationTradeQty: 0,
                                            deliveryNoticeQty: 0,
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return data;
}