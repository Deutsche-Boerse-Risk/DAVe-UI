import {UIDUtils} from '../../app/uid.utils';
import {MarginShortfallSurplusServerData} from '../../app/margin/margin.types';

const ALPHABET = 'ABCDEFGHIJKLMNOQPRSTUVWXYZ0123456789';
const CURRENCIES = ['EUR', 'CZK', 'CHF', 'ANG', 'AOA', 'BZD', 'CAD', 'CNY', 'CUC'];

export function generateShortfallSurplusLatest(members: number = 3, pools: number = 3,
                                               clearingCurrencies: number = 3, currencies: number = 3): MarginShortfallSurplusServerData[] {
    let data: MarginShortfallSurplusServerData[] = [];

    for (let j = 0; j < members; j++) {
        for (let k = 0; k < pools; k++) {
            for (let l = 0; l < clearingCurrencies; l++) {
                for (let m = 0; m < currencies; m++) {
                    let time = '2016-11-22T' + align(8 + (j + k + l + m) % 10) + ':00:00.000Z';
                    let id = {
                        _id: {
                            clearer: ALPHABET.charAt(j % ALPHABET.length),
                            member: ALPHABET.charAt((j + 1) % ALPHABET.length),
                            pool: ALPHABET.charAt((k + 4) % ALPHABET.length),
                            clearingCcy: CURRENCIES[l % CURRENCIES.length],
                            ccy: CURRENCIES[(m + 3) % CURRENCIES.length]
                        }
                    };

                    data.push({
                        ...id,
                        ...id._id,
                        id: {
                            $oid: UIDUtils.computeUID(id)
                        },
                        marginRequirement: (j - k + 1) / (l + 15 || 1),//number;
                        securityCollateral: (k - l + 2) / (m - 8 || 1),//number;
                        cashBalance: (l - m + 5) * 100 / (j + 123 || 1),//number;
                        shortfallSurplus: (m - j + 15) / (k + 1 || 1),//number;
                        marginCall: (j - k + l - m - 10) / ((l + m - 26) || 1),//number;
                        txnTm: time,//string;
                        received: time,//string;
                        // Not changing
                        poolType: 'Default',
                        reqId: null,//any;
                        rptId: '13198434645154',//string;
                        sesId: null,//any;
                        liquiMargin: 0,//number;
                        spreadMargin: 0,//number;
                        longOptionCredit: 0,//number;
                        bizDt: '2016-11-22'
                    });
                }
            }
        }
    }

    return data;
}

export function generateMarginShortfallSurplusHistory(): MarginShortfallSurplusServerData[] {

    let data: MarginShortfallSurplusServerData[] = [];
    for (let i = 0; i < 16; i++) {
        let id = {
            _id: {
                clearer: ALPHABET.charAt(0),
                member: ALPHABET.charAt(0),
                pool: ALPHABET.charAt(0),
                clearingCcy: CURRENCIES[0],
                ccy: CURRENCIES[0]
            }
        };

        let time = '2016-11-22T' + align(i + 8) + ':00:00.000Z';

        data.push({
            ...id._id,
            id: {
                $oid: UIDUtils.generateUID()
            },
            marginRequirement: random(i),//number;
            securityCollateral: random(i),//number;
            cashBalance: random(i),//number;
            shortfallSurplus: random(i),//number;
            marginCall: random(i),//number;
            txnTm: time,//string;
            received: time,//string;
            // Not changing
            poolType: 'Default',
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