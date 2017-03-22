import {UIDUtils} from '../../app/uid.utils';
import {RiskLimitsServerData} from '../../app/risk-limits/risk.limits.types';

const ALPHABET = 'ABCDEFGHIJKLMNOQPRSTUVWXYZ0123456789';

export function generateRiskLimits(members: number = 3, maintainers: number = 3,
                                   limitTypes: number = 3): RiskLimitsServerData[] {
    let data: RiskLimitsServerData[] = [];

    for (let k = 0; k < members; k++) {
        for (let l = 0; l < maintainers; l++) {
            for (let m = 0; m < limitTypes; m++) {
                let time = '2016-11-22T' + align(8 + (l + k + l + m) % 10) + ':00:00.000Z';
                let id = {
                    _id: {
                        clearer: ALPHABET.charAt(k % ALPHABET.length),
                        member: ALPHABET.charAt((k + 1) % ALPHABET.length),
                        maintainer: ALPHABET.charAt((l + 4) % ALPHABET.length),
                        limitType: ALPHABET.charAt((m + 7) % ALPHABET.length)
                    }
                };

                data.push({
                    ...id,
                    ...id._id,
                    id: {
                        $oid: UIDUtils.computeUID(id)
                    },
                    utilization: Math.abs((l - k + 1) / (m + 15 || 1)),
                    warningLevel: Math.abs((k - l + 2) / (m - 8 || 1)),
                    throttleLevel: Math.abs((l - m + 5) * 100 / (k + 123 || 1)),
                    rejectLevel: Math.abs((m - l + 15) / (k + 1 || 1)),
                    txnTm: time,//string;
                    received: time,//string;
                    // Not changing
                    reqRslt: '0',
                    txt: null,
                    reqId: null,//any;
                    rptId: '13198434645154',//string;
                });
            }
        }
    }

    return data;
}

export function generateRiskLimitsHistory(): RiskLimitsServerData[] {

    let data: RiskLimitsServerData[] = [];
    for (let i = 0; i < 16; i++) {
        let id = {
            _id: {
                clearer: ALPHABET.charAt(16),
                member: ALPHABET.charAt(16),
                maintainer: ALPHABET.charAt(16),
                limitType: ALPHABET.charAt(16)
            }
        };

        let time = '2016-11-22T' + align(i + 8) + ':00:00.000Z';

        data.push({
            ...id._id,
            id: {
                $oid: UIDUtils.generateUID()
            },
            utilization: random(i),
            warningLevel: random(i),
            throttleLevel: random(i),
            rejectLevel: random(i),
            txnTm: time,//string;
            received: time,//string;
            // Not changing
            reqRslt: '0',
            txt: null,
            reqId: null,//any;
            rptId: '13198434645154',//string;
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
    return Math.abs(val);
}