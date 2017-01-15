import {Directive, ElementRef, OnInit, Input, OnDestroy} from "@angular/core";

@Directive({
    selector: '[highlighter]'
})
export class HighlighterDirective implements OnInit, OnDestroy {

    @Input('highlighter')
    public trackBy: (index: number, row: any) => any;

    @Input()
    public context: {row: any, storage: any, index: number};

    private el: HTMLElement;

    private _timoutRef: NodeJS.Timer;

    constructor(el: ElementRef) {
        this.el = el.nativeElement;
    }

    public ngOnInit(): void {
        if (this.trackBy && this.context && this.context.storage) {
            let rowKey = this.trackBy(this.context.index, this.context.row);
            if (!this.context.storage[rowKey]) {
                this.context.storage[rowKey] = true;
                this.el.classList.add('bg-warning');
                this._timoutRef = setTimeout(() => {
                    this.el.classList.remove('bg-warning')
                }, 15000);
            }
        }
    }

    public ngOnDestroy(): void {
        if (this._timoutRef) {
            clearTimeout(this._timoutRef);
        }
    }
}