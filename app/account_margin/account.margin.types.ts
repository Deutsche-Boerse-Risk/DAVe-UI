export interface AccountMarginParams {
    clearer?: string;
    member?: string;
    account?: string;
    marginCurrency?: string;
}

export interface AccountMarginHistoryParams extends AccountMarginParams {
    clearer: string;
    member: string;
    account: string;
    marginCurrency: string;
}

export interface AccountMarginServerData extends AccountMarginHistoryParams {
    clearingCurrency: string;
    pool: string;
    marginReqInMarginCurr: number;
    marginReqInClrCurr: number;
    unadjustedMarginRequirement: number;
    variationPremiumPayment: number;
    snapshotID: number;
    businessDate: number;
    timestamp: number;
}

export interface AccountMarginData extends AccountMarginServerData {
    uid: string;
    received: Date;
}