import {PositionReportServerData} from '../../app/position_reports/position.report.types';
import {ALPHABET, CURRENCIES, PUT_CALL, UNDERLYINGS} from './mock.series';

export function generatePositionReports(members: number = 2, accounts: number = 2,
    products: number = 2, contractYears: number = 2, contractMonths: number = 2,
    expiryDays: number = 2, exercisePrice: number = 2,
    flexContractSymbol: number = 2, liquidationGroups: number = 2,
    versions: number = 2): PositionReportServerData[] {
    let data: PositionReportServerData[] = [];

    for (let j = 1; j < members + 1; j++) {
        for (let k = 1; k < accounts + 1; k++) {
            for (let l = 1; l < products + 1; l++) {
                for (let m = 1; m < contractYears + 1; m++) {
                    for (let n = 1; n < contractMonths + 1; n++) {
                        for (let o = 1; o < expiryDays + 1; o++) {
                            for (let p = 1; p < exercisePrice + 1; p++) {
                                for (let r = 1; r < flexContractSymbol + 1; r++) {
                                    for (let s = 1; s < liquidationGroups + 1; s++) {
                                        for (let t = 1; t < versions + 1; t++) {
                                            let id = {
                                                clearer              : ALPHABET.charAt(j % ALPHABET.length),
                                                member               : ALPHABET.charAt((j + 3) % ALPHABET.length),
                                                account              : ALPHABET.charAt((k + 6) % ALPHABET.length),
                                                product              : ALPHABET.charAt((l + 9) % ALPHABET.length),
                                                callPut              : PUT_CALL[l % PUT_CALL.length],
                                                contractYear         : 2010 + (Math.pow(3, m) % 17),
                                                contractMonth        : ((n * 9) % 12) + 1,
                                                expiryDay            : (o * 7) % 29,
                                                exercisePrice        : p,
                                                flexContractSymbol   : ALPHABET.charAt((r + 12) % ALPHABET.length),
                                                liquidationGroup     : ALPHABET.charAt((s + 15) % ALPHABET.length),
                                                liquidationGroupSplit: ALPHABET.charAt(
                                                    (s + 15) % ALPHABET.length) + '-' + ALPHABET.charAt(
                                                    (s + 18) % ALPHABET.length),
                                                version              : t + ''
                                            };

                                            data.push({
                                                ...id,
                                                netQuantityLs          : ((t * p) % 2 === 0 ? -1 : 1) * o * m / (k || 1),
                                                netQuantityEa          : ((s * r) % 2 === 0 ? -1 : 1) * n * l / (j || 1),
                                                clearingCurrency       : CURRENCIES[k % CURRENCIES.length],
                                                mVar                   : ((j * m ) % 2 === 0 ? -1 : 1) * r * l / (m || 1),
                                                compVar                : ((p + k + (j % 2)) % 3 === 0 ? -1 : 1) * ((p + n + (m % 2)) % 3 === 0 ? t - 7 : r + 3) * (s + 1) * p / (o || 1),
                                                compCorrelationBreak   : ((k * p) % 2 === 0 ? -1 : 1) * m * r / (j || 1),
                                                compCompressionError   : ((m * r) % 2 === 0 ? -1 : 1) * k * l / (o || 1),
                                                compLiquidityAddOn     : ((j * r) % 2 === 0 ? -1 : 1) * o * k / (l || 1),
                                                compLongOptionCredit   : ((o * k) % 2 === 0 ? -1 : 1) * p * o / (r || 1),
                                                productCurrency        : CURRENCIES[m % CURRENCIES.length],
                                                variationPremiumPayment: ((o * r) % 2 === 0 ? -1 : 1) * r * l / (k || 1),
                                                premiumMargin          : ((j * k) % 2 === 0 ? -1 : 1) * m * p / (r || 1),
                                                normalizedDelta        : ((m * r) % 2 === 0 ? -1 : 1) * m * r / (m || 1),
                                                normalizedGamma        : ((j * k) % 2 === 0 ? -1 : 1) * l * j / (o || 1),
                                                normalizedVega         : ((r * k) % 2 === 0 ? -1 : 1) * o * l / (p || 1),
                                                normalizedRho          : ((o * m) % 2 === 0 ? -1 : 1) * p * j / (l || 1),
                                                normalizedTheta        : ((k * r) % 2 === 0 ? -1 : 1) * k * p / (j || 1),
                                                underlying             : UNDERLYINGS[m % UNDERLYINGS.length],
                                                snapshotID             : 0,
                                                businessDate           : 20161215,
                                                timestamp              : Date.now() + ((l + 1) * (o + 1) * (p + 1) * (t + 1) * 1000)
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
    }

    return data;
}

export function generatePositionReportsHistory(snapshotID: number = 0): PositionReportServerData[] {

    let data: PositionReportServerData[] = [];
    for (let i = 0; i < 16; i++) {
        let id = {
            clearer              : ALPHABET.charAt(0),
            member               : ALPHABET.charAt(0),
            account              : ALPHABET.charAt(0),
            product              : ALPHABET.charAt(0),
            callPut              : PUT_CALL[0],
            contractYear         : 2016,
            contractMonth        : 12,
            expiryDay            : 15,
            exercisePrice        : 150,
            flexContractSymbol   : ALPHABET.charAt(0),
            liquidationGroup     : ALPHABET.charAt(0),
            liquidationGroupSplit: ALPHABET.charAt(0) + '-' + ALPHABET.charAt(1),
            version              : '0'
        };

        data.push({
            ...id,
            netQuantityLs          : random(i),
            netQuantityEa          : random(i),
            clearingCurrency       : CURRENCIES[1],
            mVar                   : random(i),
            compVar                : random(i),
            compCorrelationBreak   : random(i),
            compCompressionError   : random(i),
            compLiquidityAddOn     : random(i),
            compLongOptionCredit   : random(i),
            productCurrency        : CURRENCIES[0],
            variationPremiumPayment: random(i),
            premiumMargin          : random(i),
            normalizedDelta        : random(i),
            normalizedGamma        : random(i),
            normalizedVega         : random(i),
            normalizedRho          : random(i),
            normalizedTheta        : random(i),
            underlying             : UNDERLYINGS[0],
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