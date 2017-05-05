import {Directive, ElementRef, OnInit, Input, OnDestroy} from '@angular/core';

import {Row} from './data.table.component';

export const HIGHLIGHTER_CLASS = 'highlighted';
export const HIGHLIGHTER_TIMEOUT = 5000;

@Directive({
    selector: '[highlighter]'
})
export class HighlighterDirective implements OnInit, OnDestroy {

    @Input('highlighter')
    public trackBy: (index: number, row: Row<any>) => any;

    @Input('highlighterContext')
    public context: { row: any, storage: any, index: number, enabled: boolean };

    private el: HTMLElement;

    private _timeoutRef: NodeJS.Timer;

    constructor(el: ElementRef) {
        this.el = el.nativeElement;
    }

    public ngOnInit(): void {
        if (this.trackBy && this.context && this.context.storage && this.context.enabled) {
            let rowKey = this.trackBy(this.context.index, this.context.row);
            if (!this.context.storage[rowKey]) {
                this.context.storage[rowKey] = true;
                this.el.classList.add(HIGHLIGHTER_CLASS);
                this._timeoutRef = setTimeout(() => {
                    this.el.classList.remove(HIGHLIGHTER_CLASS);
                }, HIGHLIGHTER_TIMEOUT);
            }
        }
    }

    public ngOnDestroy(): void {
        if (this._timeoutRef) {
            clearTimeout(this._timeoutRef);
        }
    }
}