import {RiskLimitUtilizationServerData} from '../../app/risk_limit_utilization/risk.limit.utilization.types';
import {ALPHABET} from './mock.series';

export function generateRiskLimitUtilization(members: number = 3, maintainers: number = 3,
    limitTypes: number = 3): RiskLimitUtilizationServerData[] {
    let data: RiskLimitUtilizationServerData[] = [];

    for (let k = 1; k < members + 1; k++) {
        for (let l = 1; l < maintainers + 1; l++) {
            for (let m = 1; m < limitTypes + 1; m++) {
                data.push({
                    clearer      : ALPHABET.charAt(k % ALPHABET.length),
                    member       : ALPHABET.charAt((k + 1) % ALPHABET.length),
                    maintainer   : ALPHABET.charAt((l + 4) % ALPHABET.length),
                    limitType    : ALPHABET.charAt((m + 7) % ALPHABET.length),
                    utilization  : Math.abs((l - k + 1) / (m + 15 || 1)),
                    warningLevel : Math.abs((k - l + 2) / (m - 8 || 1)),
                    throttleLevel: Math.abs((l - m + 5) * 100 / (k + 123 || 1)),
                    rejectLevel  : Math.abs((m - l + 15) / (k + 1 || 1)),
                    snapshotID   : 0,
                    businessDate : 20161215,
                    timestamp    : Date.now() + ((l + 1) * (m + 1) * (k + 1) * 1000)
                });
            }
        }
    }

    return data;
}

export function generateRiskLimitUtilizationHistory(snapshotID: number = 0): RiskLimitUtilizationServerData[] {

    let data: RiskLimitUtilizationServerData[] = [];
    for (let i = 0; i < 16; i++) {
        data.push({
            clearer      : ALPHABET.charAt(16),
            member       : ALPHABET.charAt(16),
            maintainer   : ALPHABET.charAt(16),
            limitType    : ALPHABET.charAt(16),
            utilization  : random(i),
            warningLevel : random(i),
            throttleLevel: random(i),
            rejectLevel  : random(i),
            snapshotID   : i + 1 + snapshotID,
            businessDate : 20161215,
            timestamp    : Date.UTC(2016, 10, 15, i + 8, 0, 0)
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
    return Math.abs(val);
}