import {TestBed, async, ComponentFixtureAutoDetect, fakeAsync} from '@angular/core/testing';

import {LinkOnlyPage, RouterLinkStubDirective} from '../../testing';

import {DrilldownButtonComponent} from './drilldown.button.component';

describe('DrilldownButtonComponent', () => {

    let page: LinkOnlyPage<DrilldownButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrilldownButtonComponent, RouterLinkStubDirective],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        page = new LinkOnlyPage<DrilldownButtonComponent>(TestBed.createComponent(DrilldownButtonComponent));
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