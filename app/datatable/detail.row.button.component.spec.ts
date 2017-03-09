import {TestBed, async, ComponentFixtureAutoDetect, fakeAsync} from '@angular/core/testing';

import {LinkOnlyPage, RouterLinkStubDirective} from '../../testing';

import {DetailRowButtonComponent} from './detail.row.button.component';

describe('DetailRowButtonComponent', () => {

    let page: LinkOnlyPage<DetailRowButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DetailRowButtonComponent, RouterLinkStubDirective],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        page = new LinkOnlyPage<DetailRowButtonComponent>(TestBed.createComponent(DetailRowButtonComponent));
    });

    it('navigates correctly', fakeAsync(() => {
        page.component.routerLink = ['/test', 'url'];
        page.detectChanges();

        let navigateSpy = spyOn(page.link.stub, 'onClick').and.callThrough();

        page.link.click();

        expect(navigateSpy).toHaveBeenCalled();
        expect(page.link.stub.navigatedTo).toEqual(['/test', 'url']);
    }));
});