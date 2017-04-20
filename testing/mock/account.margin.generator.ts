import {AccountMarginServerData} from '../../app/account_margin/account.margin.types';
import {ALPHABET, CURRENCIES} from './mock.series';

export function generateAccountMargin(clearers: number = 2, members: number = 2, accounts: number = 2,
    ccys: number = 2): AccountMarginServerData[] {
    let data: AccountMarginServerData[] = [];

    for (let j = 1; j < clearers + 1; j++) {
        for (let k = 1; k < members + 1; k++) {
            for (let l = 1; l < accounts + 1; l++) {
                for (let m = 1; m < ccys + 1; m++) {
                    data.push({
                        clearer                    : ALPHABET.charAt(j % ALPHABET.length),
                        member                     : ALPHABET.charAt((k + 3) % ALPHABET.length),
                        account                    : ALPHABET.charAt((l + 6) % ALPHABET.length),
                        marginCurrency             : CURRENCIES[m % CURRENCIES.length],
                        clearingCurrency           : CURRENCIES[(m + 1) % CURRENCIES.length],
                        pool                       : ALPHABET[(m + 9) % ALPHABET.length],
                        marginReqInMarginCurr      : j + k - l - m + 15268 + (j + k + m) / 15,
                        marginReqInClrCurr         : j - k - l + m + 1125 + (m + l ) / 13,
                        unadjustedMarginRequirement: j + k - l - m + 456 + (k + j ) / 11,
                        variationPremiumPayment    : j - k + l + m + 4254 + (k + m ) / 7,
                        snapshotID                 : 0,
                        businessDate               : 20161215,
                        timestamp                  : Date.now() + ((k + 1) * (l + 1) * (k + 1) * 1000)
                    });
                }
            }
        }
    }

    return data;
}

export function generateAccountMarginHistory(snapshotID: number = 0): AccountMarginServerData[] {

    let data: AccountMarginServerData[] = [];
    for (let i = 0; i < 16; i++) {
        data.push({
            clearer                    : ALPHABET.charAt(16),
            member                     : ALPHABET.charAt(16),
            account                    : ALPHABET.charAt(16),
            marginCurrency             : CURRENCIES[0],
            clearingCurrency           : CURRENCIES[1],
            pool                       : ALPHABET[16],
            marginReqInMarginCurr      : random(i),
            marginReqInClrCurr         : random(i),
            unadjustedMarginRequirement: random(i),
            variationPremiumPayment    : random(i),
            snapshotID                 : i + 1 + snapshotID,
            businessDate               : 20161215,
            timestamp                  : Date.UTC(2016, 10, 15, i + 8, 0, 0)
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