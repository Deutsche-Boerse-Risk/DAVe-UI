import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {click} from '../events';
import {Page} from './page.base';

import {MenuComponent} from '../../app/menu/menu.component';
import {RouterLinkActiveDirective} from '../../app/menu/router.link.active.directive';

export class MenuPage extends Page<MenuComponent> {

    constructor(fixture: ComponentFixture<MenuComponent>) {
        super(fixture);
    }

    public get links(): DebugElement[] {
        return this.debugElement.queryAll(By.directive(RouterLinkActiveDirective));
    }

    public isActive(...args: string[]) {
        let activeLinkLabels: string[] = this.links.filter((link: DebugElement) => {
            return link.nativeElement.classList.contains('active');
        }).map((link: DebugElement) => {
            return link.query(By.css('a')).nativeElement.textContent.trim();
        });

        expect(activeLinkLabels.length).toBe(args.length);

        args.forEach((linkLabel: string) => {
            expect(activeLinkLabels).toContain(linkLabel);
        });
    }

    public clickLink(linkLabel: string) {
        let link: DebugElement = this.links.find((link: DebugElement) => {
            return link.query(By.css('a')).nativeElement.textContent.trim() === linkLabel;
        });

        click(link.query(By.css('a')));
        this.detectChanges();
    }
}