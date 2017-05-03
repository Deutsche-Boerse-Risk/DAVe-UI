import {TestBed, async, fakeAsync} from '@angular/core/testing';

import {LinkOnlyPage, RouterLinkStubDirective} from '../../testing';

import {NoopAnimationsMaterialModule} from '../material/material.module';

import {DetailRowButtonComponent} from './detail.row.button.component';

describe('DetailRowButtonComponent', () => {

    let page: LinkOnlyPage<DetailRowButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports     : [NoopAnimationsMaterialModule],
            declarations: [DetailRowButtonComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new LinkOnlyPage<DetailRowButtonComponent>(TestBed.createComponent(DetailRowButtonComponent));
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