import {Input, Directive, Injector, OnChanges, SimpleChanges} from '@angular/core';
import {Router, UrlTree} from '@angular/router';

import {RouterStub} from './router.stub';

@Directive({
    selector: '[routerLink]',
    host: {
        '(click)': 'onClick()'
    }
})
export class RouterLinkStubDirective implements OnChanges {

    @Input('routerLink')
    public linkParams: any;

    public navigatedTo: any = null;
    private _urlTree: UrlTree = null;

    private routerStub: RouterStub;

    constructor(injector: Injector) {
        this.routerStub = injector.get(Router, null);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.linkParams && this.routerStub) {
            this._urlTree = this.routerStub.getURLTree(this.linkParams);
        }
    }

    public onClick(): void {
        this.navigatedTo = this.linkParams;
        if (this.routerStub) {
            if (Array.isArray(this.navigatedTo)) {
                this.routerStub.navigate(this.navigatedTo);
            } else {
                this.routerStub.navigateByUrl(this.navigatedTo);
            }
        }
    }

    public get urlTree(): UrlTree {
        return this._urlTree;
    }
}