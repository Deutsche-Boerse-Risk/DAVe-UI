export interface LiquiGroupMarginParams {
    clearer?: string;
    member?: string;
    account?: string;
    marginClass?: string;
    marginCurrency?: string;
}

export interface LiquiGroupMarginHistoryParams extends LiquiGroupMarginParams {
    clearer: string;
    member: string;
    account: string;
    marginClass: string;
    marginCurrency: string;
}

export interface LiquiGroupMarginBaseData {
    premiumMargin: number;
    currentLiquidatingMargin: number;
    additionalMargin: number;
    unadjustedMarginRequirement: number;
    variationPremiumPayment: number;
}

export interface LiquiGroupMarginServerData extends LiquiGroupMarginHistoryParams, LiquiGroupMarginBaseData {
    marginGroup: string;
    futuresSpreadMargin: number;
    snapshotID: number;
    businessDate: number;
    timestamp: number;
}

export interface LiquiGroupMarginData extends LiquiGroupMarginServerData {
    uid: string;
    received: Date;
}

export interface LiquiGroupMarginAggregationData {
    aggregatedRows: LiquiGroupMarginData[];
    summary: LiquiGroupMarginBaseData;
}