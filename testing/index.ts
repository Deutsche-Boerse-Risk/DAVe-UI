import {DebugElement} from "@angular/core";
import {ComponentFixture, tick} from "@angular/core/testing";

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

export function advance(fixture: ComponentFixture<any>): void {
    tick();
    fixture.detectChanges();
}

export function setNgModelValue(element: DebugElement, value: string, realAsync: boolean = false): void {
    if (!(element.nativeElement instanceof HTMLInputElement)) {
        throw 'Not an instance of HTMLInputElement';
    }
    let input: HTMLInputElement = element.nativeElement;
    input.value = value;

    input.dispatchEvent(newEvent('input')); // tell Angular
    if (!realAsync) {
        tick();
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

