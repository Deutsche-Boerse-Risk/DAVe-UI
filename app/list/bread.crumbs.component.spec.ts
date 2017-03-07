import {DebugElement, Component} from "@angular/core";
import {By, BrowserModule} from "@angular/platform-browser";

import {ComponentFixture, TestBed, async, ComponentFixtureAutoDetect} from "@angular/core/testing";

import {click, RouterLinkStubDirective} from "../../testing";

import {BreadCrumbsComponent, RoutePart} from "./bread.crumbs.component";

@Component({
    template: '<bread-crumbs [routeParts]="routeParts"></bread-crumbs>'
})
class TestComponent {
    public routeParts: RoutePart[];
}
describe('BreadCrumbsComponent', () => {

    let hostComp: TestComponent;
    let comp: BreadCrumbsComponent;
    let fixture: ComponentFixture<TestComponent>;
    let de: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [BrowserModule],
            declarations: [TestComponent, BreadCrumbsComponent, RouterLinkStubDirective],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);

        hostComp = fixture.componentInstance;
        de = fixture.debugElement.query(By.directive(BreadCrumbsComponent));
        comp = de.injector.get(BreadCrumbsComponent);
        //.query(By.directive(RouterLinkStubDirective));
    });

    it('displays correct bread crumbs and filteres correctly', () => {
        expect(de.children.length).toBe(0, 'Nothing displayed.');

        // Add Root item
        hostComp.routeParts = [
            {
                title: 'RootItem',
                routePart: '/root'
            }
        ];
        fixture.detectChanges();
        expect(de.children.length).toBe(1, 'First displayed.');
        expect(de.queryAll(By.css('a'))[0].nativeElement.textContent.trim()).toEqual('RootItem', 'Title of first item is correct.');

        // Add Item 1
        hostComp.routeParts = hostComp.routeParts.concat({
            title: 'Item1',
            routePart: 'item1'
        });
        fixture.detectChanges();
        expect(de.children.length).toBe(2, 'First two displayed.');
        expect(de.queryAll(By.css('a'))[0].nativeElement.textContent.trim()).toEqual('RootItem', 'Title of first item is correct.');
        expect(de.queryAll(By.css('span'))[0].nativeElement.textContent.trim()).toMatch(/:\s+Item1/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[1].nativeElement.textContent.trim()).toEqual('Item1', 'Title of second item is correct.');

        // Add Item 2
        hostComp.routeParts = hostComp.routeParts.concat({
            title: 'Item2',
            routePart: 'item2'
        });
        fixture.detectChanges();
        expect(de.children.length).toBe(3, 'First three displayed.');
        expect(de.queryAll(By.css('a'))[0].nativeElement.textContent.trim()).toEqual('RootItem', 'Title of first item is correct.');
        expect(de.queryAll(By.css('span'))[0].nativeElement.textContent.trim()).toMatch(/:\s+Item1/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[1].nativeElement.textContent.trim()).toEqual('Item1', 'Title of second item is correct.');
        expect(de.queryAll(By.css('span'))[1].nativeElement.textContent.trim()).toMatch(/\/\s+Item2/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[2].nativeElement.textContent.trim()).toEqual('Item2', 'Title of third item is correct.');

        // Add Item 3
        hostComp.routeParts = hostComp.routeParts.concat({
            title: 'Item3',
            routePart: 'item3'
        });
        fixture.detectChanges();
        expect(de.children.length).toBe(4, 'First four displayed.');
        expect(de.queryAll(By.css('a'))[0].nativeElement.textContent.trim()).toEqual('RootItem', 'Title of first item is correct.');
        expect(de.queryAll(By.css('span'))[0].nativeElement.textContent.trim()).toMatch(/:\s+Item1/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[1].nativeElement.textContent.trim()).toEqual('Item1', 'Title of second item is correct.');
        expect(de.queryAll(By.css('span'))[1].nativeElement.textContent.trim()).toMatch(/\/\s+Item2/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[2].nativeElement.textContent.trim()).toEqual('Item2', 'Title of third item is correct.');
        expect(de.queryAll(By.css('span'))[2].nativeElement.textContent.trim()).toMatch(/\/\s+Item3/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[3].nativeElement.textContent.trim()).toEqual('Item3', 'Title of fourth item is correct.');

        // Filter out Item 1
        hostComp.routeParts = hostComp.routeParts.slice();
        hostComp.routeParts[1].title = '*';
        fixture.detectChanges();
        expect(de.children.length).toBe(3, 'First three displayed.');
        expect(de.queryAll(By.css('a'))[0].nativeElement.textContent.trim()).toEqual('RootItem', 'Title of first item is correct.');
        expect(de.queryAll(By.css('span'))[0].nativeElement.textContent.trim()).toMatch(/:\s+Item2/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[1].nativeElement.textContent.trim()).toEqual('Item2', 'Title of second item is correct.');
        expect(de.queryAll(By.css('span'))[1].nativeElement.textContent.trim()).toMatch(/\/\s+Item3/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[2].nativeElement.textContent.trim()).toEqual('Item3', 'Title of third item is correct.');

        // Filter out Item 3
        hostComp.routeParts = hostComp.routeParts.slice();
        hostComp.routeParts[3].title = '*';
        fixture.detectChanges();
        expect(de.children.length).toBe(2, 'First two displayed.');
        expect(de.queryAll(By.css('a'))[0].nativeElement.textContent.trim()).toEqual('RootItem', 'Title of first item is correct.');
        expect(de.queryAll(By.css('span'))[0].nativeElement.textContent.trim()).toMatch(/:\s+Item2/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[1].nativeElement.textContent.trim()).toEqual('Item2', 'Title of second item is correct.');

        // Filter out Root item
        hostComp.routeParts = hostComp.routeParts.slice();
        hostComp.routeParts[0].title = '*';
        fixture.detectChanges();
        expect(de.children.length).toBe(1, 'First displayed.');
        expect(de.queryAll(By.css('a'))[0].nativeElement.textContent.trim()).toEqual('Item2', 'Title of first item is correct.');
    });

    it('displays inactive items', () => {
        // Add Root item
        hostComp.routeParts = [
            {
                title: 'RootItem',
                routePart: '/root'
            },
            {
                title: 'Item1',
                routePart: 'item1'
            },
            {
                title: 'Item2',
                routePart: 'item2'
            },
            {
                title: 'Item3',
                routePart: 'item3'
            }
        ];
        fixture.detectChanges();
        expect(de.children.length).toBe(4, 'First four displayed.');
        expect(de.queryAll(By.css('a'))[0].nativeElement.textContent.trim()).toEqual('RootItem', 'Title of first item is correct.');
        expect(de.queryAll(By.css('span'))[0].nativeElement.textContent.trim()).toMatch(/:\s+Item1/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[1].nativeElement.textContent.trim()).toEqual('Item1', 'Title of second item is correct.');
        expect(de.queryAll(By.css('span'))[1].nativeElement.textContent.trim()).toMatch(/\/\s+Item2/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[2].nativeElement.textContent.trim()).toEqual('Item2', 'Title of third item is correct.');
        expect(de.queryAll(By.css('span'))[2].nativeElement.textContent.trim()).toMatch(/\/\s+Item3/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[3].nativeElement.textContent.trim()).toEqual('Item3', 'Title of fourth item is correct.');

        // Set Root as inactive
        hostComp.routeParts = hostComp.routeParts.slice();
        hostComp.routeParts[0].inactive = true;
        fixture.detectChanges();
        expect(de.children.length).toBe(3, 'First three displayed.');
        expect(de.nativeElement.textContent.trim()).toMatch(/^RootItem\s+/, 'Title of first item is correct.');
        expect(de.queryAll(By.css('span'))[0].nativeElement.textContent.trim()).toMatch(/:\s+Item1/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[0].nativeElement.textContent.trim()).toEqual('Item1', 'Title of second item is correct.');
        expect(de.queryAll(By.css('span'))[1].nativeElement.textContent.trim()).toMatch(/\/\s+Item2/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[1].nativeElement.textContent.trim()).toEqual('Item2', 'Title of third item is correct.');
        expect(de.queryAll(By.css('span'))[2].nativeElement.textContent.trim()).toMatch(/\/\s+Item3/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[2].nativeElement.textContent.trim()).toEqual('Item3', 'Title of fourth item is correct.');

        // Set First item as inactive
        hostComp.routeParts = hostComp.routeParts.slice();
        hostComp.routeParts[1].inactive = true;
        fixture.detectChanges();
        expect(de.children.length).toBe(3, 'First three displayed.');
        expect(de.nativeElement.textContent.trim()).toMatch(/^RootItem\s+/, 'Title of first item is correct.');
        expect(de.queryAll(By.css('span'))[0].nativeElement.textContent.trim()).toMatch(/:\s+Item1/, 'Separator and title visible');
        expect(de.queryAll(By.css('span'))[0].query(By.css('a'))).toBeNull('No link shown');
        expect(de.queryAll(By.css('span'))[1].nativeElement.textContent.trim()).toMatch(/\/\s+Item2/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[0].nativeElement.textContent.trim()).toEqual('Item2', 'Title of third item is correct.');
        expect(de.queryAll(By.css('span'))[2].nativeElement.textContent.trim()).toMatch(/\/\s+Item3/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[1].nativeElement.textContent.trim()).toEqual('Item3', 'Title of fourth item is correct.');

        // Set Second item as inactive
        hostComp.routeParts = hostComp.routeParts.slice();
        hostComp.routeParts[2].inactive = true;
        fixture.detectChanges();
        expect(de.children.length).toBe(3, 'First three displayed.');
        expect(de.nativeElement.textContent.trim()).toMatch(/^RootItem\s+/, 'Title of first item is correct.');
        expect(de.queryAll(By.css('span'))[0].nativeElement.textContent.trim()).toMatch(/:\s+Item1/, 'Separator and title visible');
        expect(de.queryAll(By.css('span'))[0].query(By.css('a'))).toBeNull('No link shown');
        expect(de.queryAll(By.css('span'))[1].nativeElement.textContent.trim()).toMatch(/\/\s+Item2/, 'Separator visible');
        expect(de.queryAll(By.css('span'))[1].query(By.css('a'))).toBeNull('No link shown');
        expect(de.queryAll(By.css('span'))[2].nativeElement.textContent.trim()).toMatch(/\/\s+Item3/, 'Separator visible');
        expect(de.queryAll(By.css('a'))[0].nativeElement.textContent.trim()).toEqual('Item3', 'Title of fourth item is correct.');

        // Set Second item as inactive
        hostComp.routeParts = hostComp.routeParts.slice();
        hostComp.routeParts[3].inactive = true;
        fixture.detectChanges();
        expect(de.children.length).toBe(3, 'First three displayed.');
        expect(de.nativeElement.textContent.trim()).toMatch(/^RootItem\s+/, 'Title of first item is correct.');
        expect(de.queryAll(By.css('span'))[0].nativeElement.textContent.trim()).toMatch(/:\s+Item1/, 'Separator and title visible');
        expect(de.queryAll(By.css('span'))[0].query(By.css('a'))).toBeNull('No link shown');
        expect(de.queryAll(By.css('span'))[1].nativeElement.textContent.trim()).toMatch(/\/\s+Item2/, 'Separator visible');
        expect(de.queryAll(By.css('span'))[1].query(By.css('a'))).toBeNull('No link shown');
        expect(de.queryAll(By.css('span'))[2].nativeElement.textContent.trim()).toMatch(/\/\s+Item3/, 'Separator visible');
        expect(de.queryAll(By.css('span'))[2].query(By.css('a'))).toBeNull('No link shown');
    });

    it('navigates correctly', () => {
        // Add Root item
        hostComp.routeParts = [
            {
                title: 'RootItem',
                routePart: '/root'
            },
            {
                title: 'Item1',
                routePart: 'item1'
            },
            {
                title: 'Item2',
                routePart: 'item2'
            },
            {
                title: 'Item3',
                routePart: 'item3'
            }
        ];
        fixture.detectChanges();

        let links: DebugElement[] = de.queryAll(By.directive(RouterLinkStubDirective));
        for (let i = 0; i < links.length; i++) {
            let routerLink: RouterLinkStubDirective = links[i].injector.get(RouterLinkStubDirective);

            click(links[i]);

            expect(routerLink.navigatedTo.length).toBe(i + 1);
            expect(routerLink.navigatedTo[i]).toEqual(hostComp.routeParts[i].routePart);
        }
    });
});