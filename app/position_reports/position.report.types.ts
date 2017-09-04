export interface PositionReportsParams {
    clearer?: string,
    member?: string,
    account?: string,
    underlying?: string,
    liquidationGroup?: string,
    liquidationGroupSplit?: string,
    product?: string,
    callPut?: string,
    contractYear?: string,
    contractMonth?: string,
    expiryDay?: string,
    exercisePrice?: string,
    version?: string,
    flexContractSymbol?: string
}

export interface PositionReportsHistoryParams extends PositionReportsParams {
    clearer: string,
    member: string,
    account: string,
    underlying: string,
    liquidationGroup: string,
    liquidationGroupSplit: string,
    product: string,
    callPut: string,
    contractYear: string,
    contractMonth: string,
    expiryDay: string,
    exercisePrice: string,
    version: string,
    flexContractSymbol: string
}

export interface PositionReportServerData {
    clearer: string;
    member: string;
    account: string;
    product: string;
    callPut: string;
    contractYear: number;
    contractMonth: number;
    expiryDay: number;
    exercisePrice: number;
    flexContractSymbol: string;
    liquidationGroup: string;
    liquidationGroupSplit: string;
    version: string;
    netQuantityLs: number;
    netQuantityEa: number;
    clearingCurrency: string;
    mVar: number;
    compVar: number;
    compCorrelationBreak: number;
    compCompressionError: number;
    compLiquidityAddOn: number;
    compLongOptionCredit: number;
    productCurrency: string;
    variationPremiumPayment: number;
    premiumMargin: number;
    normalizedDelta: number;
    normalizedGamma: number;
    normalizedVega: number;
    normalizedRho: number;
    normalizedTheta: number;
    underlying: string;
    snapshotID: number;
    businessDate: number;
    timestamp: number;
}

export interface PositionReportData extends PositionReportServerData {
    uid: string;
    received: Date;
    contractDate: Date;
}

export type SelectValues = {
    record?: PositionReportBubble;
    subRecords: PositionReportChartDataSelect
}

export interface PositionReportChartDataSelect {
    options: {
        [key: string]: SelectValues
    };
    key?: string;
}

export function toOptionsArray(selection: PositionReportChartDataSelect): PositionReportBubble[] {
    return Object.keys(selection.options).map((key: string) => {
        return selection.options[key].record;
    });
}

export interface PositionReportBubble {
    key: string;
    memberKey: string;
    hAxisKey: string;
    clearer: string;
    member: string;
    account: string;
    symbol: string;
    putCall: string;
    maturityMonthYear: string;
    underlying: string;
    radius: number;
}

export interface PositionReportChartData {
    clearingCurrency: string;
    bubbles: PositionReportBubble[];
    selection: PositionReportChartDataSelect;
    memberSelection: PositionReportBubble;
    accountSelection: PositionReportBubble;
}