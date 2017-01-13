import {Directive, Input} from '@angular/core';
import {UrlTree, ActivatedRoute, Router} from '@angular/router';

@Directive({selector: '[routerSubLink]'})
export class RouterSubLinkDirective {

    private commands: any[] = [];

    constructor(private router: Router, private route: ActivatedRoute) {
    }

    @Input()
    public set routerSubLink(commands: any[] | string) {
        if (commands != null) {
            this.commands = Array.isArray(commands) ? commands : [commands];
        } else {
            this.commands = [];
        }
    }

    public get urlTree(): UrlTree {
        return this.router.createUrlTree(this.commands, {
            relativeTo: this.route,
        });
    }
}