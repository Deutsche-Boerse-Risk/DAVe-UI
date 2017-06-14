import {
    AfterContentInit,
    ContentChildren,
    Directive,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    QueryList,
    Renderer2,
    SimpleChanges
} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkWithHref} from '@angular/router';

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
    public routerLinkActiveOptions: { exact: boolean } = {exact: false};

    constructor(private router: Router, private element: ElementRef, private renderer: Renderer2) {
        this.subscription = router.events.subscribe(s => {
            if (s instanceof NavigationEnd) {
                this.update();
            }
        });
    }

    public ngAfterContentInit(): void {
        this.links.changes.subscribe(s => this.update());
        this.linksWithHrefs.changes.subscribe(s => this.update());
        this.subLinks.changes.subscribe(s => this.update());
        this.update();
    }

    @Input()
    public set routerLinkActive(data: string[] | string) {
        if (Array.isArray(data)) {
            this.classes = <any>data;
        } else {
            this.classes = data.split(' ');
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.update();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private update(): void {
        if (!this.links || !this.linksWithHrefs || !this.subLinks || !this.router.navigated) {
            return;
        }

        const isActive = this.hasActiveLink();
        this.classes.forEach(c => {
            if (c) {
                if (isActive) {
                    this.renderer.addClass(this.element.nativeElement, c);
                } else {
                    this.renderer.removeClass(this.element.nativeElement, c);
                }
            }
        });
    }

    private isLinkActive(router: Router): (link: (
        RouterSubLinkDirective
        | RouterLink
        | RouterLinkWithHref)) => boolean {
        return (link: RouterSubLinkDirective | RouterLink | RouterLinkWithHref) =>
            router.isActive(link.urlTree, this.routerLinkActiveOptions.exact);
    }

    private hasActiveLink(): boolean {
        return this.links.some(this.isLinkActive(this.router))
            || this.linksWithHrefs.some(this.isLinkActive(this.router))
            || this.subLinks.some(this.isLinkActive(this.router));
    }

}