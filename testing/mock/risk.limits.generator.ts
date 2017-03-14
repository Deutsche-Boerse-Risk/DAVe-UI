import {UIDUtils} from '../../app/uid.utils';
import {RiskLimitsServerData} from '../../app/risk-limits/risk.limits.types';

const ALPHABET = 'ABCDEFGHIJKLMNOQPRSTUVWXYZ0123456789';

export function generateRiskLimits(clearers: number = 3, members: number = 3,
                                   maintainers: number = 3, limitTypes: number = 3): RiskLimitsServerData[] {
    let data: RiskLimitsServerData[] = [];

    for (let j = 0; j < clearers; j++) {
        for (let k = 0; k < members; k++) {
            for (let l = 0; l < maintainers; l++) {
                for (let m = 0; m < limitTypes; m++) {
                    let time = '2016-11-22T' + align(8 + (j + k + l + m) % 10) + ':00:00.000Z';
                    let id = {
                        _id: {
                            clearer: ALPHABET.charAt(j % ALPHABET.length),
                            member: ALPHABET.charAt(l % ALPHABET.length),
                            maintainer: ALPHABET.charAt(m % ALPHABET.length),
                            limitType: ALPHABET.charAt(m % ALPHABET.length)
                        }
                    };

                    data.push({
                        ...id,
                        ...id._id,
                        id: {
                            $oid: UIDUtils.computeUID(id)
                        },
                        utilization: Math.abs((j - k + 1) / (l + 15 || 1)),
                        warningLevel: Math.abs((k - l + 2) / (m - 8 || 1)),
                        throttleLevel: Math.abs((l - m + 5) * 100 / (j + 123 || 1)),
                        rejectLevel: Math.abs((m - j + 15) / (k + 1 || 1)),
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