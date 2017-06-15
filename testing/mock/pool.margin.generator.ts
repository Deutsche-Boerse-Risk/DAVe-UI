import {PoolMarginServerData} from '../../app/pool_margin/pool.margin.types';
import {ALPHABET, CURRENCIES} from './mock.series';

export function generatePoolMarginLatest(clearers: number = 2, pools: number = 2,
    marginCurrencies: number = 2): PoolMarginServerData[] {
    let data: PoolMarginServerData[] = [];

    for (let j = 1; j < clearers + 1; j++) {
        for (let k = 1; k < pools + 1; k++) {
            for (let l = 1; l < marginCurrencies + 1; l++) {
                data.push({
                    clearer              : ALPHABET.charAt(j % ALPHABET.length),
                    pool                 : ALPHABET.charAt((k + 3) % ALPHABET.length),
                    marginCurrency       : CURRENCIES[(l + 6) % CURRENCIES.length],
                    clrRptCurrency       : CURRENCIES[(l + 9) % CURRENCIES.length],
                    requiredMargin       : (j - k + 1) / (l + 15 || 1),//number;
                    cashCollateralAmount : (k - l + 2) / (j - 8 || 1),//number;
                    adjustedSecurities   : (l - k + 5) * 100 / (j + 123 || 1),//number;
                    adjustedGuarantee    : (l - j + 15) / (k + 1 || 1),//number;
                    overUnderInMarginCurr: (j - k + l - 10) / ((l + k - 26) || 1),//number;
                    overUnderInClrRptCurr: (j + l - 2) / ((k - 7) || 1),//number;
                    variPremInMarginCurr : (k * l * j - 13) / ((j + 11) || 1),//number;
                    adjustedExchangeRate : (j * k + l - 7) / ((l - 27) || 1),//number;
                    poolOwner            : ALPHABET.charAt((k + 12) % ALPHABET.length),
                    snapshotID           : 0,
                    businessDate         : 20161215,
                    timestamp            : Date.now() + ((l + 1) * (j + 1) * (k + 1) * 1000)
                });
            }
        }
    }
    return data;
}

export function generatePoolMarginHistory(snapshotID: number = 0): PoolMarginServerData[] {

    let data: PoolMarginServerData[] = [];
    for (let i = 0; i < 16; i++) {
        data.push({
            clearer              : ALPHABET.charAt(0),
            pool                 : ALPHABET.charAt(0),
            marginCurrency       : CURRENCIES[0],
            clrRptCurrency       : CURRENCIES[0],
            requiredMargin       : random(i),
            cashCollateralAmount : random(i),
            adjustedSecurities   : random(i),
            adjustedGuarantee    : random(i),
            overUnderInMarginCurr: random(i),
            overUnderInClrRptCurr: random(i),
            variPremInMarginCurr : random(i),
            adjustedExchangeRate : random(i),
            poolOwner            : ALPHABET.charAt(0),
            snapshotID           : i + 1 + snapshotID,
            businessDate         : 20161215,
            timestamp            : Date.UTC(2016, 10, 15, i + 8, 0, 0)
        });
    }
    return data;
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