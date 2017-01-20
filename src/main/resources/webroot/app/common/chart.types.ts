export interface CommonChartOptions {

    fontSize?: number;

    forceIFrame?: boolean;

    title?: string;
    titleTextStyle?: ChartTextStyle;
}

export interface ChartOptions extends CommonChartOptions {
    animation?: ChartAnimation;

    axisTitlesPosition?: 'in' | 'out' | 'none';

    backgroundColor?: string | ChartBackgroundStyle;

    chartArea?: ChartArea;

    colors?: string[];

    enableInteractivity?: boolean;

    explorer?: ChartExplorer;

    fontName?: string;

    hAxis?: ChartAxis;

    height?: number;

    legend?: ChartLegend;

    selectionMode?: 'single' | 'multiple';

    series?: Series[] | {[key: string]: Series};

    theme?: 'maximized';

    titlePosition?: 'in' | 'out' | 'none';

    tooltip?: ChartTooltip;

    vAxis?: ChartAxis;

    width?: number;
}

export interface LineChartOptions extends ChartOptions {
    aggregationTarget?: 'category' | 'series' | 'auto' | 'none';

    crosshair?: ChartCrossHair;

    curveType?: 'none' | 'function';

    dataOpacity?: number;

    focusTarget?: 'datum' | 'category';

    interpolateNulls?: boolean;

    lineDashStyle?: number[];

    lineWidth?: number;

    orientation?: 'vertical' | 'horizontal';

    pointShape?: PointShapeType |  PointShapeWithSides |  PointShapeWithSidesAndDent |  PointShapeWithRotation;
    pointSize?: number;
    pointsVisible?: boolean;

    reverseCategories?: boolean;

    series?: LineSeries[];

    trendlines?: {
        [key: number]: ChartTrendLine
    };
}

export interface BubbleChartOptions extends ChartOptions {
    colorAxis?: ChartColorAxis;

    bubble?: {
        opacity?: number;
        stroke?: string;
        textStyle?: ChartTextStyle;
    };

    series?: {[key: string]: Series};

    sizeAxis?: {
        minSize?: number;
        minValue?: number;
        maxSize?: number;
        maxValue?: number;
    }

    sortBubblesBySize?: boolean;
}

export interface TreeMapOptions extends CommonChartOptions {
    fontColor?: string;

    fontFamily?: string;

    headerColor?: string;

    headerHeight?: number;
    headerHighlightColor?: string;

    highlightOnMouseOver?: boolean;

    hintOpacity?: number;

    maxColor?: string;
    maxDepth?: number;
    maxHighlightColor?: string;
    maxPostDepth?: number;
    maxColorValue?: number;

    midColor?: string;
    midHighlightColor?: string;

    minColor?: string;
    minHighlightColor?: string;
    minColorValue?: number;

    noColor?: string;
    noHighlightColor?: string;

    showScale?: boolean;
    showTooltips?: boolean;

    textStyle?: ChartTextStyle;

    useWeightedAverageForAggregation?: boolean;
}

export interface ChartTrendLine {
    color?: string;
    opacity?: number;
    degree?: number;
    labelInLegend?: string;
    lineWidth?: number;
    pointSize?: number;
    pointsVisible?: boolean;
    showR2?: boolean;
    type?: 'linear'|'exponential'|'polynomial';
    visibleInLegend?: boolean;
}

export interface ChartCrossHair extends ChartCrossHairProperties {
    focused?: ChartCrossHairProperties;
    selected?: ChartCrossHairProperties;
    trigger?: 'focus' | 'selection' | 'both';
}

export interface ChartCrossHairProperties {
    color?: string;
    opacity?: number;
    orientation?: 'vertical' | 'horizontal' | 'both';
}

export interface Series {
    color?: string;
    visibleInLegend?: boolean;
}

export interface LineSeries extends Series {
    pointShape?: PointShapeType |  PointShapeWithSides |  PointShapeWithSidesAndDent |  PointShapeWithRotation
    pointSize?: number;
}

export type PointShapeType = 'circle' | 'triangle' | 'square' | 'diamond' | 'star' |'polygon';

export interface PointShapeWithSides {
    type?: 'star' | 'polygon';
    sides?: number
}
export interface PointShapeWithSidesAndDent {
    type?: 'star';
    sides?: number;
    dent?: number
}
export interface PointShapeWithRotation {
    type?: PointShapeType;
    rotation?: number;
}

export type ExplorerAction = 'dragToPan' | 'dragToZoom' | 'rightClickToReset';

export interface ChartExplorer {
    actions?: ExplorerAction[];
    axis?: 'vertical' | 'horizontal';
    keepInBounds?: boolean;
    maxZoomIn?: number;
    maxZoomOut?: number;
    zoomDelta?: number;
}

export interface ChartAnimation {

    duration?: number;

    easing?: 'linear' | 'in' | 'out' | 'inAndOut';

    startup?: boolean;
}

export interface ChartColorAxis {

    minValue?: number;

    maxValue?: number;

    values?: number[];

    colors?: string[];

    legend?: {
        position?: 'top' | 'bottom' | 'in' | 'none';
        textStyle?: ChartTextStyle;
        numberFormat?: string;
    };
}

export interface ChartTooltip {
    isHtml?: boolean;
    textStyle?: ChartTextStyle;
    trigger?: 'focus' | 'none' | 'selection';
}

export interface ChartLegend {
    alignment?: 'start' | 'center' | 'end' | 'automatic';
    maxLines?: number;
    position?: 'bottom' | 'left' | 'in' | 'none' | 'right' | 'top';
    textStyle?: ChartTextStyle;
}

export interface ChartAxisGridLines {
    color?: string;
    count?: number;
    units?: {
        years?: {format?: string[]},
        months?: {format?: string[]},
        days?: {format?: string[]}
        hours?: {format?: string[]}
        minutes?: {format?: string[]}
        seconds?: {format?: string[]},
        milliseconds?: {format?: string[]},
    }
}

export type ChartValue = any | {
    v?: any;
    f?: string;
}

export interface ChartAxis {
    baseline?: number;
    baselineColor?: string;
    direction?: 1 | -1;
    format?: string;
    slantedText?: boolean;

    gridlines?: ChartAxisGridLines;
    minorGridlines?: ChartAxisGridLines;

    logScale?: boolean;
    scaleType?: 'log'| 'mirrorLog';

    textPosition?: 'out'| 'in'| 'none';
    textStyle?: ChartTextStyle;

    ticks?: ChartValue[];

    title?: string;
    titleTextStyle?: ChartTextStyle;

    maxValue?: number;
    minValue?: number;

    viewWindowMode?: 'pretty' | 'maximized' | 'explicit';

    viewWindow?: {
        max?: number;
        min?: number;
    }
}

export interface ChartArea {
    backgroundColor?: string | ChartBackgroundStyle;
    left?: number | string;
    bottom?: number | string;
    right?: number | string;
    top?: number | string;
    width?: number | string;
    height?: number | string;
}

export interface ChartBackgroundStyle {
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
}

export interface ChartTextStyle {
    color?: string;
    fontName?: string;
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    display?: string;
}

export interface ChartColumn {
    id?: string;
    label?: string;
    type?: 'string' | 'number' | 'date';
}

export interface ChartRow {
    c?: ChartValue[];
    originalData?: any;
}

export interface ChartData {
    cols?: ChartColumn[];
    rows?: ChartRow[];
}

export type SelectionEvent = SelectedItem[];

export interface SelectedItem {
    row: number;
    column: number;
}

declare global {
    module google {
        module visualization {
            class DataTable {
                constructor(chartData: ChartData);

                addColumn(type: string, label?: string, id?: string): number;
                addColumn(description_object: IColumnDescription): number;

                insertRows(atRowIndex: number, numOfRows: number): void;
                insertRows(atRowIndex: number, populatedRows: any[]): void;

                addRows(numOrArray: number | any[]): number;

                addRow(cellArray?: ICell[]): number;
            }

            interface ICell {
                v: string | number | Date;
                f: string;
                p: any;
            }

            interface IColumnDescription {
                type: string;
                label?: string;
                id?: string;
                role?: string;
                pattern?: string;
            }

            class DataView {
                constructor(dataTable: DataTable);

                hideColumns(columnIndexes: number[]): void;

                hideRows(min: number, max: number): void;
                hideRows(rowIndexes: number[]): void;
            }

            class Chart {
                getSelection(): SelectedItem[];

                draw(dataTable: DataView | DataTable | ChartData, options: CommonChartOptions): void;
            }

            class ChartWrapper {
                constructor(chart: {
                    chartType: string;
                    dataTable: DataView | DataTable | ChartData;
                    options: CommonChartOptions;
                    containerId: string;
                });

                draw(container?: HTMLElement | string): void;

                getChart(): Chart;

                clear(): void;
            }

            module events {
                type EventListenerHandle = any;

                function addListener(object: Chart | ChartWrapper, eventName: string, listener: () => any): EventListenerHandle;

                function removeListener(handle: EventListenerHandle): void;
            }
        }

        module charts {
            function load(version: 'current' | 'upcoming', modules: {packages: string[]}): void;

            function setOnLoadCallback(callback: () => any): void;
        }
    }
}