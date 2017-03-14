import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {click} from '../events';
import {Page} from './page.base';

import {DownloadMenuComponent} from '../../app/list/download.menu.component';

export class DownloadMenuPage extends Page<DownloadMenuComponent> {

    constructor(fixture: ComponentFixture<DownloadMenuComponent>) {
        super(fixture);
    }

    public get downloadLink(): DebugElement {
        return this.debugElement.query(By.css('a'));
    }

    public clickDownloadLink(): void {
        click(this.downloadLink);
        this.detectChanges();
    }
}