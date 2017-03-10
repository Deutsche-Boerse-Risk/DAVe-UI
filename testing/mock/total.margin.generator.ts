import {UIDUtils} from '../../app/uid.utils';
import {TotalMarginServerData} from '../../app/total-margin/total.margin.types';

const ALPHABET = 'ABCDEFGHIJKLMNOQPRSTUVWXYZ0123456789';
const CURRENCIES = ['EUR', 'CZK', 'CHF'];

export function generateTotalMargin(clearers: number = 3, pools: number = 3,
                                    members: number = 3, accounts: number = 3,
                                    ccys: number = 3): TotalMarginServerData[] {
    let data: TotalMarginServerData[] = [];

    for (let j = 0; j < clearers; j++) {
        for (let k = 0; k < pools; k++) {
            for (let l = 0; l < members; l++) {
                for (let m = 0; m < accounts; m++) {
                    for (let n = 0; n < ccys; n++) {
                        let time = '2016-11-22T' + align(8 + (j + k + l + m + n) % 10) + ':00:00.000Z';
                        let id = {
                            _id: {
                                clearer: ALPHABET.charAt(j % ALPHABET.length),
                                pool: ALPHABET.charAt(k % ALPHABET.length),
                                member: ALPHABET.charAt(l % ALPHABET.length),
                                account: ALPHABET.charAt(m % ALPHABET.length),
                                ccy: CURRENCIES[n % CURRENCIES.length]
                            }
                        };

                        data.push({
                            ...id,
                            ...id._id,
                            id: {
                                $oid: UIDUtils.computeUID(id)
                            },
                            unadjustedMargin: j + k - l + m - n + 15268 + (j + l + n) / 15,
                            adjustedMargin: j - k + l - m + n + 1297345 + (k + m ) / 15,
                            txnTm: time,//string;
                            received: time,//string;
                            // Not changing
                            reqId: null,//any;
                            rptId: '13198434645154',//string;
                            sesId: null,//any;
                            bizDt: '2016-11-22'
                        });
                    }
                }
            }
        }
    }

    return data;
}

export function generateTotalMarginHistory(): TotalMarginServerData[] {

    let data: TotalMarginServerData[] = [];
    for (let i = 0; i < 16; i++) {
        let id = {
            _id: {
                clearer: ALPHABET.charAt(16),
                pool: ALPHABET.charAt(16),
                member: ALPHABET.charAt(16),
                account: ALPHABET.charAt(16),
                ccy: CURRENCIES[16]
            }
        };

        let time = '2016-11-22T' + align(i + 8) + ':00:00.000Z';

        data.push({
            ...id._id,
            id: {
                $oid: UIDUtils.generateUID()
            },
            unadjustedMargin: random(i),//number;
            adjustedMargin: random(i),//number;
            txnTm: time,//string;
            received: time,//string;
            // Not changing
            reqId: null,//any;
            rptId: '13198434645154',//string;
            sesId: null,//any;
            liquiMargin: 0,//number;
            spreadMargin: 0,//number;
            longOptionCredit: 0,//number;
            bizDt: '2016-11-22'
        });
    }
    return data;
}

function align(i: number): string {
    if (i < 10) {
        return '0' + i;
    }
    return i + '';
}

function random(i: number, modulo: number = 100): number {
    let val = i * Math.random() + (Math.random() * 100) - 50;
    while (val > modulo) {
        val -= modulo;
    }
    while (val < -modulo) {
        val += modulo;
    }
    return val;
}