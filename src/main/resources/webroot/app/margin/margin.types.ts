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

export interface MarginAccountAggregationData {
    _id: {
        clearer: string;
        member: string;
        account: string;
        clss: string;
        ccy: string
    };

    id: {
        $oid: string
    };

    clearer: string;
    member: string;
    account: string;
    clss: string;
    ccy: string;
    txnTm: string;
    bizDt: string;
    reqId: any;
    rptId: string;
    sesId: any;
    variationMargin: number;
    premiumMargin: number;
    liquiMargin: number;
    spreadMargin: number;
    additionalMargin: number;
    marketRisk: number;
    longOptionCredit: number;
    liquRisk: number;
    received: string;
}