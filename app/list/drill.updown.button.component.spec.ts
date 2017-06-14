import {async, fakeAsync, TestBed} from '@angular/core/testing';

import {LinkOnlyPage, RouterLinkStubDirective} from '@dbg-riskit/DAVe-UI-testing';

import {NoopAnimationsCommonViewModule} from '@dbg-riskit/DAVe-UI-view';

import {DrillUpDownButtonComponent} from './drill.updown.button.component';

describe('DrillUpDownButtonComponent', () => {

    let page: LinkOnlyPage<DrillUpDownButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports     : [NoopAnimationsCommonViewModule],
            declarations: [DrillUpDownButtonComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new LinkOnlyPage<DrillUpDownButtonComponent>(TestBed.createComponent(DrillUpDownButtonComponent));
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