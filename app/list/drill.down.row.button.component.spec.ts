import {async, fakeAsync, TestBed} from '@angular/core/testing';

import {LinkOnlyPage, RouterLinkStubDirective} from '@dbg-riskit/dave-ui-testing';

import {NoopAnimationsCommonViewModule} from '@dbg-riskit/dave-ui-view';

import {DrillDownRowButtonComponent} from './drill.down.row.button.component';

describe('DrillDownRowButtonComponent', () => {

    let page: LinkOnlyPage<DrillDownRowButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports     : [NoopAnimationsCommonViewModule],
            declarations: [DrillDownRowButtonComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new LinkOnlyPage<DrillDownRowButtonComponent>(TestBed.createComponent(DrillDownRowButtonComponent));
        page.detectChanges();
    }));

    it('navigates correctly', fakeAsync(() => {
        page.component.routerLink = ['/test', 'url'];
        page.detectChanges();

        let navigateSpy = spyOn(page.link.stub, 'onClick').and.callThrough();

        page.link.click();

        expect(navigateSpy).toHaveBeenCalled();
        expect(page.link.stub.navigatedTo).toEqual(['/test', 'url']);
    }));
});