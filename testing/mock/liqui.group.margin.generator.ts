import {LiquiGroupMarginServerData} from '../../app/liqui_group_margin/liqui.group.margin.types';
import {ALPHABET, CURRENCIES, PUT_CALL} from './mock.series';

export function generateLiquiGroupMargin(members: number = 2, accounts: number = 2, marginClasses: number = 2,
    marginCurrencies: number = 2): LiquiGroupMarginServerData[] {
    let data: LiquiGroupMarginServerData[] = [];

    for (let j = 1; j < members + 1; j++) {
        for (let k = 1; k < accounts + 1; k++) {
            for (let l = 1; l < marginClasses + 1; l++) {
                for (let m = 1; m < marginCurrencies + 1; m++) {
                    let id = {
                        clearer       : ALPHABET.charAt(j % ALPHABET.length),
                        member        : ALPHABET.charAt((j + 3) % ALPHABET.length),
                        account       : ALPHABET.charAt((k + 6) % ALPHABET.length),
                        marginClass   : ALPHABET.charAt((l + 9) % ALPHABET.length),
                        marginCurrency: CURRENCIES[(m + 12) % PUT_CALL.length]
                    };

                    data.push({
                        ...id,
                        marginGroup                : ALPHABET.charAt((k + 12) % ALPHABET.length),
                        premiumMargin              : (j - k + 1) / (l + 15 || 1),
                        currentLiquidatingMargin   : (m - l + 2) / (j - 8 || 1),
                        futuresSpreadMargin        : (l - k + 5) * 100 / (j + 123 || 1),
                        additionalMargin           : (m - j + 15) / (k + 1 || 1),
                        unadjustedMarginRequirement: (j - k + l - 10) / ((l + m - 26) || 1),
                        variationPremiumPayment    : (j * m + l - 7) / ((l - 27) || 1),
                        snapshotID                 : 0,
                        businessDate               : 20161215,
                        timestamp                  : Date.now() + ((j + 1) * (k + 1) * (l + 1) * (m + 1) * 1000)
                    });
                }
            }
        }
    }
    return data;
}

export function generateLiquiGroupMarginHistory(snapshotID: number = 0): LiquiGroupMarginServerData[] {

    let data: LiquiGroupMarginServerData[] = [];
    for (let i = 0; i < 16; i++) {

        let id = {
            clearer       : ALPHABET.charAt(0),
            member        : ALPHABET.charAt(0),
            account       : ALPHABET.charAt(0),
            marginClass   : ALPHABET.charAt(0),
            marginCurrency: CURRENCIES[0]
        };

        data.push({
            ...id,
            marginGroup                : ALPHABET.charAt(0),
            premiumMargin              : random(i),
            currentLiquidatingMargin   : random(i),
            futuresSpreadMargin        : random(i),
            additionalMargin           : random(i),
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