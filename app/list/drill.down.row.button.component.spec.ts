import {fakeAsync, TestBed} from '@angular/core/testing';

import {
    compileTestBed,
    LinkOnlyPage,
    NoopAnimationsCommonViewModule,
    RouterLinkStubDirective
} from '@dbg-riskit/dave-ui-testing';

import {DrillDownRowButtonComponent} from './drill.down.row.button.component';

describe('DrillDownRowButtonComponent', () => {

    let page: LinkOnlyPage<DrillDownRowButtonComponent>;

    compileTestBed(() => {
        return TestBed.configureTestingModule({
            imports     : [NoopAnimationsCommonViewModule],
            declarations: [DrillDownRowButtonComponent, RouterLinkStubDirective]
        }).compileComponents();
    }, () => {
        page.destroy();
        page = null;
    });

    beforeEach(fakeAsync(() => {
        page = new LinkOnlyPage<DrillDownRowButtonComponent>(TestBed.createComponent(DrillDownRowButtonComponent));
        page.component.routerLink = ['/test', 'url'];
        page.detectChanges();
    }));

    it('navigates correctly', fakeAsync(() => {

        let navigateSpy = spyOn(page.link.stub, 'onClick').and.callThrough();

        page.link.click();

        expect(navigateSpy).toHaveBeenCalled();
        expect(page.link.stub.navigatedTo).toEqual(['/test', 'url']);
    }));
});