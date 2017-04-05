export interface PoolMarginParams {
    clearer?: string;
    pool?: string;
    marginCurrency?: string;
}

export interface PoolMarginHistoryParams extends PoolMarginParams {
    clearer: string;
    pool: string;
    marginCurrency: string;
}

export interface PoolMarginServerData extends PoolMarginHistoryParams {
    clrRptCurrency: string;
    requiredMargin: number;
    cashCollateralAmount: number;
    adjustedSecurities: number;
    adjustedGuarantee: number;  // Obsolete
    overUnderInMarginCurr: number;
    overUnderInClrRptCurr: number;
    variPremInMarginCurr: number;
    adjustedExchangeRate: number;
    poolOwner: string;
    snapshotID: number;
    businessDate: number;
    timestamp: number;
}

export interface PoolMarginData extends PoolMarginServerData {
    uid: string;
    received: Date;
}

export interface PoolMarginSummaryData {
    shortfallSurplus: number; // -> overUnderInMarginCurr
    marginRequirement: number; // -> requiredMargin
    totalCollateral: number; //cashCollateralAmount + adjustedSecurities + adjustedGuarantee + variPremInMarginCurr
    cashBalance: number;  // cashCollateralAmount  + variPremInMarginCurr
}