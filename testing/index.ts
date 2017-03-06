import {DebugElement} from "@angular/core";
import {ComponentFixture, tick} from "@angular/core/testing";
import {GoogleChart} from "../app/common/google.chart.component";

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvents = {
    left: {button: 0},
    right: {button: 2}
};

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
    if (el instanceof HTMLElement) {
        el.click();
    } else {
        el.triggerEventHandler('click', eventObj);
    }
}

export function advance(fixture: ComponentFixture<any>, millis: number = 0): void {
    tick(millis);
    if (millis > 0) {
        tick();
    }
    fixture.detectChanges();
}

export function setNgModelValue(element: DebugElement, value: string, realAsync: boolean = false): void {
    if (!(element.nativeElement instanceof HTMLInputElement)) {
        throw 'Not an instance of HTMLInputElement';
    }
    let input: HTMLInputElement = element.nativeElement;
    input.value = value;

    dispatchEvent(input, 'input'); // tell Angular
    if (!realAsync) {
        tick();
    }
}

export function setNgModelSelectValue(element: DebugElement, selectedIndex: number, realAsync: boolean = false): void {
    if (!(element.nativeElement instanceof HTMLSelectElement)) {
        throw 'Not an instance of HTMLInputElement';
    }
    let input: HTMLSelectElement = element.nativeElement;
    input.selectedIndex = selectedIndex;

    dispatchEvent(input, 'change'); // tell Angular
    if (!realAsync) {
        tick();
    }
}

export function dispatchEvent(element: DebugElement | HTMLElement | Window, eventName: string) {
    if (element instanceof HTMLElement) {
        element.dispatchEvent(newEvent(eventName));
    } else if (element instanceof Window) {
        element.dispatchEvent(newEvent(eventName));
    } else {
        element.nativeElement.dispatchEvent(newEvent(eventName));
    }
}

/**
 * Create custom DOM event the old fashioned way
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Event/initEvent
 * Although officially deprecated, some browsers (phantom) don't accept the preferred "new Event(eventName)"
 */
export function newEvent(eventName: string, bubbles = false, cancelable = false) {
    let evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
    evt.initCustomEvent(eventName, bubbles, cancelable, null);
    return evt;
}

/**
 * Special function that allows us to bind events so we can wait for chart rendering.
 */
export function waitForChart(chart: GoogleChart, done: () => any) {
    let drawFunction: () => void = (chart as any).drawGraph;
    (chart as any).drawGraph = () => {
        let wrapper = (chart as any).wrapper;
        waitForChartRedraw(chart, done);
        if (!wrapper) {
            google.charts.setOnLoadCallback(() => {
                let drawProto = google.visualization.ChartWrapper.prototype.draw;
                google.visualization.ChartWrapper.prototype.draw = function () {
                    wrapper = (chart as any).wrapper;
                    google.visualization.ChartWrapper.prototype.draw = drawProto;
                    let handle = google.visualization.events.addListener(wrapper, 'ready', function () {
                        google.visualization.events.removeListener(handle);
                        done();
                    });
                    drawProto.bind(wrapper)();
                };
            });
        }

        (chart as any).drawGraph = drawFunction;
        drawFunction.bind(chart)();
    };
}

export function waitForChartRedraw(chart: GoogleChart, done: () => any) {
    let wrapper = (chart as any).wrapper;
    if (wrapper) {
        let handle = google.visualization.events.addListener(wrapper, 'ready', function () {
            google.visualization.events.removeListener(handle);
            done();
        });
    }
}

