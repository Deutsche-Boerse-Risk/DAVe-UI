import {TestBed, async, fakeAsync} from '@angular/core/testing';

import {LinkOnlyPage, RouterLinkStubDirective} from '../../testing';

import {DrilldownButtonComponent} from './drilldown.button.component';

xdescribe('DrilldownButtonComponent', () => {

    let page: LinkOnlyPage<DrilldownButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrilldownButtonComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new LinkOnlyPage<DrilldownButtonComponent>(TestBed.createComponent(DrilldownButtonComponent));
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