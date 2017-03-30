import {UIDUtils} from '../../app/uid.utils';
import {MarginComponentsServerData} from '../../app/margin/margin.types';
import {ALPHABET, CURRENCIES} from './mock.series';

export function generateMarginComponents(members: number = 3, accounts: number = 3,
    classes: number = 3, currencies: number = 3): MarginComponentsServerData[] {
    let data: MarginComponentsServerData[] = [];

    for (let j = 0; j < members; j++) {
        for (let k = 0; k < accounts; k++) {
            for (let l = 0; l < classes; l++) {
                for (let m = 0; m < currencies; m++) {
                    let time = '2016-11-22T' + align(8 + (j + k + l + m) % 10) + ':00:00.000Z';
                    let id = {
                        _id: {
                            clearer: ALPHABET.charAt(j % ALPHABET.length),
                            member : ALPHABET.charAt((j + 1) % ALPHABET.length),
                            account: ALPHABET.charAt((k + 4) % ALPHABET.length),
                            clss   : ALPHABET.charAt((l + 7) % ALPHABET.length),
                            ccy    : CURRENCIES[m % CURRENCIES.length]
                        }
                    };

                    data.push({
                        ...id,
                        ...id._id,
                        id              : {
                            $oid: UIDUtils.computeUID(id)
                        },
                        variationMargin : (j - k) / (l || 1),//number;
                        premiumMargin   : (k - l) / (m || 1),//number;
                        additionalMargin: (l - m) / (j || 1),//number;
                        marketRisk      : (m - j) / (k || 1),//number;
                        liquRisk        : (j - k + l - m) / ((l + m) || 1),//number;
                        txnTm           : time,//string;
                        received        : time,//string;
                        // Not changing
                        reqId           : null,//any;
                        rptId           : '13198434645154',//string;
                        sesId           : null,//any;
                        liquiMargin     : 0,//number;
                        spreadMargin    : 0,//number;
                        longOptionCredit: 0,//number;
                        bizDt           : '2016-11-22'
                    });
                }
            }
        }
    }

    return data;
}

export function generateMarginComponentsHistory(): MarginComponentsServerData[] {

    let data: MarginComponentsServerData[] = [];
    for (let i = 0; i < 16; i++) {
        let id = {
            _id: {
                clearer: ALPHABET.charAt(16),
                member : ALPHABET.charAt(16),
                account: ALPHABET.charAt(16),
                clss   : ALPHABET.charAt(16),
                symbol : ALPHABET.charAt(16),
                ccy    : CURRENCIES[16]
            }
        };

        let time = '2016-11-22T' + align(i + 8) + ':00:00.000Z';

        data.push({
            ...id._id,
            id              : {
                $oid: UIDUtils.generateUID()
            },
            variationMargin : random(i),//number;
            premiumMargin   : random(i),//number;
            additionalMargin: random(i),//number;
            marketRisk      : random(i),//number;
            liquRisk        : random(i),//number;
            txnTm           : time,//string;
            received        : time,//string;
            // Not changing
            reqId           : null,//any;
            rptId           : '13198434645154',//string;
            sesId           : null,//any;
            liquiMargin     : 0,//number;
            spreadMargin    : 0,//number;
            longOptionCredit: 0,//number;
            bizDt           : '2016-11-22'
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