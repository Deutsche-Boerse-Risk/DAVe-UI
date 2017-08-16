import {fakeAsync, TestBed} from '@angular/core/testing';

import {
    compileTestBed,
    LinkOnlyPage,
    NoopAnimationsCommonViewModule,
    RouterLinkStubDirective
} from '@dbg-riskit/dave-ui-testing';

import {DetailRowButtonComponent} from './detail.row.button.component';

describe('DetailRowButtonComponent', () => {

    let page: LinkOnlyPage<DetailRowButtonComponent>;

    compileTestBed(() => {
        return TestBed.configureTestingModule({
            imports     : [NoopAnimationsCommonViewModule],
            declarations: [DetailRowButtonComponent, RouterLinkStubDirective]
        }).compileComponents();
    }, () => {
        page.destroy();
        page = null;
    });

    beforeEach(fakeAsync(() => {
        page = new LinkOnlyPage<DetailRowButtonComponent>(TestBed.createComponent(DetailRowButtonComponent));
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