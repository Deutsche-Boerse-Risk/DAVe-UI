export interface RiskLimitsServerData {
    _id: {
        clearer: string;
        member: string;
        maintainer: string;
        limitType: string;
    };
    id: {
        $oid: string;
    };
    clearer: string;
    member: string;
    maintainer: string;
    reqId: string;
    rptId: string;
    txnTm: string;
    reqRslt: string;
    txt: string;
    limitType: string;
    utilization: number;
    warningLevel: number;
    throttleLevel: number;
    rejectLevel: number;
    received: string;
}

export interface RiskLimitsData {
    uid: string;
    clearer: string;
    member: string;
    maintainer: string;
    limitType: string;
    utilization: number;
    warningLevel: number;
    warningUtil?: number;
    throttleLevel: number;
    throttleUtil?: number;
    rejectLevel: number;
    rejectUtil?: number;
    received: Date;
}