export interface MarginShortfallServerSurplus {
    _id?: {
        clearer?: string;
        pool?: string;
        member?: string;
        clearingCcy?: string;
        ccy?: string
    };

    id?: {
        $oid?: string
    };

    clearer?: string
    pool?: string;
    poolType?: string;
    member?: string;
    clearingCcy?: string;
    ccy?: string;
    txnTm?: string;
    bizDt?: string;
    reqId?: any;
    rptId?: string;
    sesId?: any;
    marginRequirement?: number;
    securityCollateral?: number;
    cashBalance?: number;
    shortfallSurplus?: number;
    marginCall?: number;
    received?: string
}

export interface MarginShortfallSurplus {
    shortfallSurplus?: number;
    marginRequirement?: number;
    securityCollateral?: number;
    cashBalance?: number;
    marginCall?: number;
}

export interface MarginAccountServerData {
    _id?: {
        clearer?: string;
        member?: string;
        account?: string;
        clss?: string;
        ccy?: string
    };

    id?: {
        $oid?: string
    };

    clearer?: string;
    member?: string;
    account?: string;
    clss?: string;
    ccy?: string;
    txnTm?: string;
    bizDt?: string;
    reqId?: any;
    rptId?: string;
    sesId?: any;
    variationMargin?: number;
    premiumMargin?: number;
    liquiMargin?: number;
    spreadMargin?: number;
    additionalMargin?: number;
    absAdditionalMargin?: number;
    marketRisk?: number;
    longOptionCredit?: number;
    liquRisk?: number;
    received?: string;
}

export interface MarginAccountDataBase {
    clearer?: string;
    member?: string;
    account?: string;
    variationMargin: number;
    liquiMargin: number;
    premiumMargin: number;
    spreadMargin: number;
    additionalMargin: number;
    absAdditionalMargin?: number;
}

export interface MarginAccountData extends MarginAccountDataBase {
    class: string;
    ccy: string;
}

export interface MarginAccountExportData extends MarginAccountData {
    bizDt: string;
    variLiqui?: number;
    received: string;
}

export interface MarginAccountAggregationData {
    aggregatedRows: MarginAccountDataBase[];
    summary: MarginAccountDataBase;
}