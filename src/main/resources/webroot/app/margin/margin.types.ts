export interface MarginShortfallSurplusServerData {
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

export interface MarginShortfallSurplusBase {
    shortfallSurplus: number;
    marginRequirement: number;
    securityCollateral: number;
    cashBalance: number;
    marginCall: number;
}

export interface MarginShortfallSurplusData extends MarginShortfallSurplusBase {
    clearer: string
    pool: string;
    poolType: string;
    member: string;
    clearingCcy: string;
    ccy: string;
    bizDt: string;
    received: Date;
}

export interface MarginComponentsServerData {
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

export interface MarginComponentsBaseData {
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

export interface MarginComponentsRowData extends MarginComponentsBaseData {
    class: string;
    ccy: string;
    bizDt: string;
    variLiqui?: number;
    received: Date;
}

export interface MarginComponentsAggregationData {
    aggregatedRows: MarginComponentsBaseData[];
    summary: MarginComponentsBaseData;
}