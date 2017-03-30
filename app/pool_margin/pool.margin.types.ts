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

export interface PoolMarginBase {
    // uid: string;
    // shortfallSurplus: number;  ???  marginCall: number; ??? overUnderInMarginCurr
    // marginRequirement: number;  requiredMargin
    // securityCollateral: number; cashCollateralAmount + adjustedSecurities + adjustedGuarantee + variPremInMarginCurr
    // cashBalance: number;   cashCollateralAmount  + variPremInMarginCurr

}

export interface PoolMarginServerData extends PoolMarginHistoryParams, PoolMarginBase {
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