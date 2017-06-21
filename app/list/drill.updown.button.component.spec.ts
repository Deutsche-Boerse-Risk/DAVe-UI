import {fakeAsync, TestBed} from '@angular/core/testing';

import {compileTestBed, LinkOnlyPage, RouterLinkStubDirective} from '@dbg-riskit/dave-ui-testing';

import {NoopAnimationsCommonViewModule} from '@dbg-riskit/dave-ui-view';

import {DrillUpDownButtonComponent} from './drill.updown.button.component';

describe('DrillUpDownButtonComponent', () => {

    let page: LinkOnlyPage<DrillUpDownButtonComponent>;

    compileTestBed(() => {
        return TestBed.configureTestingModule({
            imports     : [NoopAnimationsCommonViewModule],
            declarations: [DrillUpDownButtonComponent, RouterLinkStubDirective]
        }).compileComponents();
    });

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