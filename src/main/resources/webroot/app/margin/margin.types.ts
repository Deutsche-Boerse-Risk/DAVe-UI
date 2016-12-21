export interface MarginShortfallSurplus {
    _id: {
        clearer: string;
        pool: string;
        member: string;
        clearingCcy: string;
        ccy: string
    };
    id: {
        $oid: string
    };
    clearer: string
    pool: string;
    poolType: string;
    member: string;
    clearingCcy: string;
    ccy: string;
    txnTm: string;
    bizDt: string;
    reqId: any;
    rptId: string;
    sesId: any;
    marginRequirement: number;
    securityCollateral: number;
    cashBalance: number;
    shortfallSurplus: number;
    marginCall: number;
    received: string
}