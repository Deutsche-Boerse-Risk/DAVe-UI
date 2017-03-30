import {LiquiGroupSplitMarginServerData} from '../../app/liqui_group_split_margin/liqui.group.split.margin.types';
import {ALPHABET, CURRENCIES, PUT_CALL} from './mock.series';

export function generateLiquiGroupSplitMargin(members: number = 2, accounts: number = 2, liquidationGroups: number = 2,
    liquidationGroupSplits: number = 2, marginCurrencies: number = 2): LiquiGroupSplitMarginServerData[] {
    let data: LiquiGroupSplitMarginServerData[] = [];

    for (let j = 1; j < members + 1; j++) {
        for (let k = 1; k < accounts + 1; k++) {
            for (let l = 1; l < liquidationGroups + 1; l++) {
                for (let m = 1; m < liquidationGroupSplits + 1; m++) {
                    for (let n = 1; n < marginCurrencies + 1; n++) {
                        let id = {
                            clearer              : ALPHABET.charAt(j % ALPHABET.length),
                            member               : ALPHABET.charAt((j + 3) % ALPHABET.length),
                            account              : ALPHABET.charAt((k + 6) % ALPHABET.length),
                            liquidationGroup     : ALPHABET.charAt((l + 9) % ALPHABET.length),
                            liquidationGroupSplit: ALPHABET.charAt((m + 12) % ALPHABET.length),
                            marginCurrency       : CURRENCIES[(n + 15) % PUT_CALL.length]
                        };

                        data.push({
                            ...id,
                            premiumMargin          : (j - k + 1) / (n + 15 || 1),
                            marketRisk             : (m - l + 2) / (j - 8 || 1),
                            liquRisk               : (l - n + 5) * 100 / (j + 123 || 1),
                            longOptionCredit       : (m - j + 15) / (k + 1 || 1),
                            variationPremiumPayment: (j * m + l - 7) / ((n - 27) || 1),
                            snapshotID             : 0,
                            businessDate           : 20161215,
                            timestamp              : Date.now() + ((j + 1) * (k + 1) * (l + 1) * (m + 1) * (n + 1) * 1000)
                        });
                    }
                }
            }
        }
    }

    return data;
}

export function generateLiquiGroupSplitMarginHistory(snapshotID: number = 0): LiquiGroupSplitMarginServerData[] {

    let data: LiquiGroupSplitMarginServerData[] = [];
    for (let i = 0; i < 16; i++) {

        let id = {
            clearer              : ALPHABET.charAt(0),
            member               : ALPHABET.charAt(0),
            account              : ALPHABET.charAt(0),
            liquidationGroup     : ALPHABET.charAt(0),
            liquidationGroupSplit: ALPHABET.charAt(0),
            marginCurrency       : CURRENCIES[0]
        };

        data.push({
            ...id,
            premiumMargin          : random(i),
            marketRisk             : random(i),
            liquRisk               : random(i),
            longOptionCredit       : random(i),
            variationPremiumPayment: random(i),
            snapshotID             : i + 1 + snapshotID,
            businessDate           : 20161215,
            timestamp              : Date.UTC(2016, 10, 15, i + 8, 0, 0)
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