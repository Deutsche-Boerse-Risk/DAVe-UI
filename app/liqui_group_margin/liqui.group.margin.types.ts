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

export interface LiquiGroupMarginServerData extends LiquiGroupMarginHistoryParams {
    marginGroup: string;
    premiumMargin: number;
    currentLiquidatingMargin: number;
    futuresSpreadMargin: number;
    additionalMargin: number;
    unadjustedMarginRequirement: number;
    variationPremiumPayment: number;
    snapshotID: number;
    businessDate: number;
    timestamp: number;
}

export interface LiquiGroupMarginData extends LiquiGroupMarginServerData {
    uid: string;
    received: Date;
}