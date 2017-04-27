import {Component, ElementRef, Input} from '@angular/core';

export const ERROR_SELECTOR = 'error';
export const GOOD_SELECTOR = 'good';
export const INFO_SELECTOR = 'info';
export const MESSAGE_SELECTOR = 'message';
export const WARN_SELECTOR = 'warn';

export const INITIAL_LOAD_SELECTOR = 'initial-load';
export const NO_DATA_SELECTOR = 'no-data';
export const UPDATE_FAILED_SELECTOR = 'update-failed';

const COMPONENT_SELECTOR = ERROR_SELECTOR + ', ' + GOOD_SELECTOR + ', ' + INFO_SELECTOR + ', ' + MESSAGE_SELECTOR + ', '
    + WARN_SELECTOR + ', ' + INITIAL_LOAD_SELECTOR + ', ' + NO_DATA_SELECTOR + ', ' + UPDATE_FAILED_SELECTOR;
@Component({
    moduleId : module.id,
    selector : COMPONENT_SELECTOR,
    template : `
        <md-card [ngClass]="color">
            <ng-template [ngIf]="initialLoad">Loading...</ng-template>
            <ng-template [ngIf]="noData">No data available.</ng-template>
            <ng-template [ngIf]="updateError">Failed to update the data: {{message}}.</ng-template>
            <ng-template [ngIf]="!initialLoad && !noData && !updateError">{{message}}</ng-template>
        </md-card>`,
    styleUrls: ['../common.component.css']
})
export class MessageComponent {

    private _initialLoad: boolean;
    private _noData: boolean;
    private _updateError: boolean;
    private _color: 'good' | 'info' | 'error' | 'warn' | null;

    @Input('message')
    public message: string;

    constructor(elementRef: ElementRef) {
        const tagName = elementRef.nativeElement.tagName.toLowerCase();
        this._initialLoad = tagName === INITIAL_LOAD_SELECTOR;
        this._noData = tagName === NO_DATA_SELECTOR;
        this._updateError = tagName === UPDATE_FAILED_SELECTOR;
        switch (tagName) {
            case INFO_SELECTOR:
            case NO_DATA_SELECTOR:
                this._color = 'info';
                break;
            case WARN_SELECTOR:
            case INITIAL_LOAD_SELECTOR:
                this._color = 'warn';
                break;
            case ERROR_SELECTOR:
            case UPDATE_FAILED_SELECTOR:
                this._color = 'error';
                break;
            case GOOD_SELECTOR:
                this._color = 'good';
                break;
            default:
                this._color = null;
        }
    }

    public get color(): string {
        return this._color;
    }

    public get initialLoad(): boolean {
        return this._initialLoad;
    }

    public get noData(): boolean {
        return this._noData;
    }

    public get updateError(): boolean {
        return this._updateError;
    }
}