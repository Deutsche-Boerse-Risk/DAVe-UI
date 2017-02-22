import {DebugElement, Component} from "@angular/core";
import {By} from "@angular/platform-browser";

import {ComponentFixture, TestBed, async, ComponentFixtureAutoDetect} from "@angular/core/testing";

import {UpdateFailedComponent} from "./update.failed.component";

describe('UpdateFailedComponent', () => {

    let comp: UpdateFailedComponent;
    let fixture: ComponentFixture<UpdateFailedComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateFailedComponent],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UpdateFailedComponent);

        comp = fixture.componentInstance;

        // query for the title by CSS element selector
        de = fixture.debugElement.query(By.css('.alert'));
        el = de.nativeElement;
    });

    it('has correct text', () => {

        expect(el.textContent).toContain('Failed to update the data: .');
        comp.error = 'custom error message';
        fixture.detectChanges();
        expect(el.textContent).toContain('Failed to update the data: ' + comp.error + '.');
    });
});

@Component({
    template: '<update-failed [message]="errorMessage"></update-failed>'
})
class TestHostComponent {
    public errorMessage: string = 'custom error message';
}

describe('UpdateFailedComponent hosted', () => {

    let hostComp: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateFailedComponent, TestHostComponent],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        hostFixture = TestBed.createComponent(TestHostComponent);

        hostComp = hostFixture.componentInstance;

        // query for the title by CSS element selector
        de = hostFixture.debugElement.query(By.css('.alert'));
        el = de.nativeElement;
    });

    it('has correct text whenever hosted', () => {
        // Test
        expect(el.textContent).toContain('Failed to update the data: custom error message.');
        hostComp.errorMessage = 'new custom error message';
        hostFixture.detectChanges();
        expect(el.textContent).toContain('Failed to update the data: ' + hostComp.errorMessage + '.');
    });
});