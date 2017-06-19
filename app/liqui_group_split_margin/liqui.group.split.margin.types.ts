export interface LiquiGroupSplitMarginParams {
    clearer?: string;
    member?: string;
    account?: string;
    liquidationGroup?: string;
    liquidationGroupSplit?: string;
}

export interface LiquiGroupSplitMarginHistoryParams extends LiquiGroupSplitMarginParams {
    clearer: string;
    member: string;
    account: string;
    liquidationGroup: string;
    liquidationGroupSplit: string;
    marginCurrency: string;
}

export interface LiquiGroupSplitMarginServerData extends LiquiGroupSplitMarginHistoryParams {
    premiumMargin: number;
    marketRisk: number;
    liquRisk: number;
    longOptionCredit: number;
    variationPremiumPayment: number;
    snapshotID: number;
    businessDate: number;
    timestamp: number;
}

export interface LiquiGroupSplitMarginData extends LiquiGroupSplitMarginServerData {
    uid: string;
    additionalMargin: number;
    received: Date;
}