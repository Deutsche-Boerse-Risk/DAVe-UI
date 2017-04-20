export interface RiskLimitUtilizationParams {
    clearer?: string;
    member?: string;
    maintainer?: string;
    limitType?: string;
}

export interface RiskLimitUtilizationHistoryParams extends RiskLimitUtilizationParams {
    clearer: string;
    member: string;
    maintainer: string;
    limitType: string;
}

export interface RiskLimitUtilizationServerData extends RiskLimitUtilizationHistoryParams {
    utilization: number;
    warningLevel: number;
    throttleLevel: number;
    rejectLevel: number;
    snapshotID: number;
    businessDate: number;
    timestamp: number;
}

export interface RiskLimitUtilizationData extends RiskLimitUtilizationServerData {
    uid: string;
    warningUtil: number;
    throttleUtil: number;
    rejectUtil: number;
    received: Date;
}