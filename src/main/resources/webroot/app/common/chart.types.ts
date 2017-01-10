export interface ChartOptions {
    animation?: ChartAnimation;

    axisTitlesPosition?: 'in' | 'out' | 'none';

    backgroundColor?: string | ChartBackgroundStyle;

    chartArea?: ChartArea;

    colors?: string[];

    enableInteractivity?: boolean;

    explorer?: ChartExplorer;

    fontSize?: number;

    fontName?: string;

    forceIFrame?: boolean;

    hAxis?: ChartAxis;

    height?: number;

    legend?: ChartLegend;

    selectionMode?: 'single' | 'multiple';

    series?: {
        [key: string]: {
            color?: string;
            visibleInLegend?: boolean;
        }
    };

    theme?: 'maximized';

    title?: string;

    titlePosition?: 'in' | 'out' | 'none';

    titleTextStyle?: ChartTextStyle;

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

    series?: {
        [key: string]: {
            color?: string;
            visibleInLegend?: boolean;
            pointShape?: PointShapeType |  PointShapeWithSides |  PointShapeWithSidesAndDent |  PointShapeWithRotation
            pointSize?: number;
        }
    };

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

    sizeAxis?: {
        minSize?: number;
        minValue?: number;
        maxSize?: number;
        maxValue?: number;
    }

    sortBubblesBySize?: boolean;
}

export interface TreeMapOptions extends ChartOptions {

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
}

export interface ChartData {
    cols?: ChartColumn[];
    rows?: ChartRow[];
}