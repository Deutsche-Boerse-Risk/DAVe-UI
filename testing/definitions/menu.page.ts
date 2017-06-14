import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {click, Page} from '@dbg-riskit/DAVe-UI-testing';

import {MenuComponent} from '../../app/menu/menu.component';
import {RouterLinkActiveDirective} from '../../app/menu/router.link.active.directive';

export class MenuPage extends Page<MenuComponent> {

    constructor(fixture: ComponentFixture<MenuComponent>) {
        super(fixture);
    }

    public get links(): DebugElement[] {
        let links: DebugElement[] = [],
            all = new Set(this.debugElement.queryAll(By.directive(RouterLinkActiveDirective)));
        all.forEach((link: DebugElement) => {
            links.push(link);
        });
        return links;
    }

    public isActive(...args: string[]) {
        let activeLinkLabels: string[] = this.links.filter((link: DebugElement) => {
            return link.nativeElement.classList.contains('active');
        }).map((link: DebugElement) => {
            return link.nativeElement.textContent.trim();
        });

        expect(activeLinkLabels.length).toBe(args.length);

        args.forEach((linkLabel: string) => {
            expect(activeLinkLabels.some((activeLinkLabel) => {
                return activeLinkLabel.indexOf(linkLabel) !== -1;
            })).toBeTruthy(linkLabel + ' not is active!');
        });
    }

    public clickLink(linkLabel: string) {
        let link: DebugElement = this.links.find((link: DebugElement) => {
            return link.nativeElement.textContent.trim().indexOf(linkLabel) !== -1;
        });

        click(link.nativeElement);
        this.detectChanges(500);
    }
}