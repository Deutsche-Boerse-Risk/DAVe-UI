export interface ChartOptions {
    explorer?: ChartExplorer;

    legend?: ChartLegend;

    hAxis?: ChartAxis;
    vAxis?: ChartAxis;

    chartArea?: ChartArea;

    backgroundColor?: string | ChartBackgroundStyle;

    series?: {
        [key: string]: {
            color?: string;
            visibleInLegend?: boolean;
        }
    };

    fontColor?: string;

    titlePosition?: 'in' | 'out' | 'none';

    titleTextStyle?: ChartForegroundStyle;

    title?: string;
}

export interface BubbleChartOptions extends ChartOptions {

    bubble?: {
        opacity?: number;
        stroke?: string;
        textStyle?: ChartForegroundStyle;
    };

    sortBubblesBySize?: boolean;
}

export type ExplorerAction = 'dragToPan' | 'dragToZoom' | 'rightClickToReset';

export interface ChartExplorer {
    actions?: ExplorerAction[];
    axis?: string;
    keepInBounds?: boolean;
    maxZoomIn?: number;
    maxZoomOut?: number;
    zoomDelta?: number;
}

export interface ChartLegend {
    alignment?: 'start'|'center'|'end'| 'automatic';
    maxLines?: number;
    position?: 'bottom' | 'left' | 'in' | 'none' | 'right' | 'top';
    textStyle?: ChartForegroundStyle;
}

export interface ChartAxis {
    title?: string;
    ticks?: any[];
    slantedText?: boolean;
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

export interface ChartForegroundStyle {
    color?: string;
    fontName?: string;
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    display?: string;
}

export interface ChartColumn {
    id: string;
    type: 'string' | 'number';
}

export interface ChartRow {
    c: any[];
}

export interface ChartData {
    cols: ChartColumn[];
    rows?: ChartRow[];
}