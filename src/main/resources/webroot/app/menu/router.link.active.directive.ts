import {
    Directive, Input, AfterContentInit, OnDestroy, OnChanges, ContentChildren, QueryList,
    ElementRef, Renderer
} from '@angular/core';
import {Router, NavigationEnd, RouterLinkWithHref, RouterLink} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';

import {RouterSubLinkDirective} from './router.sub.link.directive';

@Directive({
    selector: '[routerLinkActive]'
})
export class RouterLinkActiveDirective implements OnChanges, OnDestroy, AfterContentInit {

    @ContentChildren(RouterLink, {descendants: true})
    public links: QueryList<RouterLink>;

    @ContentChildren(RouterLinkWithHref, {descendants: true})
    public linksWithHrefs: QueryList<RouterLinkWithHref>;

    @ContentChildren(RouterSubLinkDirective, {descendants: true})
    public subLinks: QueryList<RouterSubLinkDirective>;

    private classes: string[] = [];
    private subscription: Subscription;

    @Input()
    public routerLinkActiveOptions: {exact: boolean} = {exact: false};

    constructor(private router: Router, private element: ElementRef, private renderer: Renderer) {
        this.subscription = router.events.subscribe(s => {
            if (s instanceof NavigationEnd) {
                this.update();
            }
        });
    }

    ngAfterContentInit(): void {
        this.links.changes.subscribe(s => this.update());
        this.linksWithHrefs.changes.subscribe(s => this.update());
        this.subLinks.changes.subscribe(s => this.update());
        this.update();
    }

    @Input()
    set routerLinkActive(data: string[]|string) {
        if (Array.isArray(data)) {
            this.classes = <any>data;
        } else {
            this.classes = data.split(' ');
        }
    }

    ngOnChanges(changes: {}): any {
        this.update();
    }

    ngOnDestroy(): any {
        this.subscription.unsubscribe();
    }

    private update(): void {
        if (!this.links || !this.linksWithHrefs || !this.subLinks || !this.router.navigated) return;

        const isActive = this.hasActiveLink();
        this.classes.forEach(c => {
            if (c) {
                this.renderer.setElementClass(this.element.nativeElement, c, isActive);
            }
        });
    }

    private isLinkActive(router: Router): (link: (RouterSubLinkDirective | RouterLink | RouterLinkWithHref)) => boolean {
        return (link: RouterSubLinkDirective) =>
            router.isActive(link.urlTree, this.routerLinkActiveOptions.exact);
    }

    private hasActiveLink(): boolean {
        return this.links.some(this.isLinkActive(this.router))
            || this.linksWithHrefs.some(this.isLinkActive(this.router))
            || this.subLinks.some(this.isLinkActive(this.router));
    }

}