import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {click} from '../events';
import {Page} from './page.base';

import {DownloadMenuComponent} from '../../app/list/download.menu.component';
import Spy = jasmine.Spy;

export class DownloadMenuPage extends Page<DownloadMenuComponent> {

    constructor(fixture: ComponentFixture<DownloadMenuComponent>) {
        super(fixture);
    }

    public get downloadLink(): DownloadLink {
        return new DownloadLink(this.debugElement.query(By.css('a')), this);
    }
}

export class DownloadLink {
    private _blobSpy: jasmine.Spy;
    private _saveBlobSpy: jasmine.Spy;

    constructor(public element: DebugElement, private page: {detectChanges: () => void}) {
    }

    public click(): void {
        this.blobSpy;
        this.saveSpy;
        click(this.element);
        this.page.detectChanges();
    }

    public get blobSpy(): Spy {
        if (!this._blobSpy) {
            let blobConstructor = Blob;
            this._blobSpy = spyOn(window, 'Blob').and
                .callFake((blobParts?: any[], options?: BlobPropertyBag) => new blobConstructor(blobParts, options));
        }
        return this._blobSpy;
    }

    public get saveSpy(): Spy {
        if (!this._saveBlobSpy) {
            this._saveBlobSpy = spyOn(window as any, 'saveAs');
        }
        return this._saveBlobSpy;
    }
}