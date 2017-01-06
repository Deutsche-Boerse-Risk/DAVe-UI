export interface TotalMarginServerData {
    _id: {
        clearer: string;
        pool: string;
        member: string;
        account: string;
        ccy: string;
    };
    id: {
        $oid: string;
    };
    clearer: string;
    pool: string;
    member: string;
    account: string;
    ccy: string;
    txnTm: string;
    bizDt: string;
    reqId: any;
    rptId: string;
    sesId: any;
    unadjustedMargin: number;
    adjustedMargin: number;
    received: string;
}

export interface TotalMarginData {
    clearer: string;
    pool: string;
    member: string;
    account: string;
    ccy: string;
    adjustedMargin: number;
    unadjustedMargin: number;
    bizDt: string;
    received: string;
}