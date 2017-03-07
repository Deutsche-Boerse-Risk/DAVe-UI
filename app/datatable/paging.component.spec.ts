import {async, TestBed, ComponentFixtureAutoDetect, fakeAsync, tick} from "@angular/core/testing";

import {TestHostComponent, DataTableDefinitionHosted} from "../../testing/data.table.test.def";

import {DataTableModule} from "./data.table.module";


describe('DataTable component shows pager ', () => {

    let table: DataTableDefinitionHosted;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [DataTableModule],
            declarations: [TestHostComponent],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        table = new DataTableDefinitionHosted(TestBed.createComponent(TestHostComponent));
        table.fixture.detectChanges();
        tick();
    }));

    it('and correctly navigates to next page', () => {
        expect(table.pager.debugElement).not.toBeNull('Is shown.');

        // Check button states for first page
        expect(table.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.pager.expectLeadingButtonsDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([1, 2, 3, 4]);
        table.pager.expectButtonActive(2);

        // Go to next
        table.pager.click(6);

        // Check button states
        expect(table.pager.pageButtons.length).toBe(9, 'To display first and last two + 5 with numbers.');
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([1, 2, 3, 4, 5]);
        table.pager.expectButtonActive(3);

        // Go to next
        table.pager.click(7);

        // Check button states
        expect(table.pager.pageButtons.length).toBe(10, 'To display first and last two + 6 with numbers.');
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([1, 2, 3, 4, 5, 6]);
        table.pager.expectButtonActive(4);

        // Go to next
        table.pager.click(8);

        // Check button states
        expect(table.pager.pageButtons.length).toBe(11, 'To display first and last two + 7 with numbers.');
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([1, 2, 3, 4, 5, 6, 7]);
        table.pager.expectButtonActive(5);

        // Go to next
        table.pager.click(9);

        // Check button states
        expect(table.pager.pageButtons.length).toBe(11, 'To display first and last two + 7 with numbers.');
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([2, 3, 4, 5, 6, 7, 8]);
        table.pager.expectButtonActive(5);

        // Go to next
        table.pager.click(8);

        // Check button states
        expect(table.pager.pageButtons.length).toBe(11, 'To display first and last two + 7 with numbers.');
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([5, 6, 7, 8, 9, 10, 11]);
        table.pager.expectButtonActive(5);
    });

    it('and correctly navigates to previous page', () => {
        expect(table.pager.debugElement).not.toBeNull('Is shown.');

        // Check button states for first page
        expect(table.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.pager.expectLeadingButtonsDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([1, 2, 3, 4]);
        table.pager.expectButtonActive(2);

        // Go to last
        table.pager.click(7);

        // Check button states for last page
        expect(table.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsDisabled();
        table.pager.expectButtonNumbers([22, 23, 24, 25]);
        table.pager.expectButtonActive(5);

        // Go to previous
        table.pager.click(1);

        // Check button states
        expect(table.pager.pageButtons.length).toBe(9, 'To display first and last two + 5 with numbers.');
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([21, 22, 23, 24, 25]);
        table.pager.expectButtonActive(5);

        // Go to previous
        table.pager.click(1);

        // Check button states
        expect(table.pager.pageButtons.length).toBe(10, 'To display first and last two + 6 with numbers.');
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([20, 21, 22, 23, 24, 25]);
        table.pager.expectButtonActive(5);

        // Go to previous
        table.pager.click(1);

        // Check button states
        expect(table.pager.pageButtons.length).toBe(11, 'To display first and last two + 7 with numbers.');
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([19, 20, 21, 22, 23, 24, 25]);
        table.pager.expectButtonActive(5);

        // Go to previous
        table.pager.click(1);

        // Check button states
        expect(table.pager.pageButtons.length).toBe(11, 'To display first and last two + 7 with numbers.');
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([18, 19, 20, 21, 22, 23, 24]);
        table.pager.expectButtonActive(5);
    });

    it('and correctly navigates to first and last page', () => {
        expect(table.pager.debugElement).not.toBeNull('Is shown.');

        // Check button states for first page
        expect(table.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.pager.expectLeadingButtonsDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([1, 2, 3, 4]);
        table.pager.expectButtonActive(2);

        // Go to some page
        table.pager.click(5);

        // Check button states
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([1, 2, 3, 4, 5, 6, 7]);
        table.pager.expectButtonActive(5);

        // Go to first
        table.pager.click(0);

        // Check button states for first page
        expect(table.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.pager.expectLeadingButtonsDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([1, 2, 3, 4]);
        table.pager.expectButtonActive(2);

        // Go to last
        table.pager.click(7);

        // Check button states for last page
        expect(table.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsDisabled();
        table.pager.expectButtonNumbers([22, 23, 24, 25]);
        table.pager.expectButtonActive(5);

        // Go to first
        table.pager.click(0);

        // Check button states for first page
        expect(table.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.pager.expectLeadingButtonsDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([1, 2, 3, 4]);
        table.pager.expectButtonActive(2);

    });

    it('and correctly changes page size whenever data size is changed', fakeAsync(() => {
        expect(table.pager.debugElement).not.toBeNull('Is shown.');

        // Check button states for first page
        expect(table.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.pager.expectLeadingButtonsDisabled();
        table.pager.expectTrailingButtonsNotDisabled();
        table.pager.expectButtonNumbers([1, 2, 3, 4]);
        table.pager.expectButtonActive(2);

        // Go to last page
        table.pager.click(7);

        // Check button states for last page
        expect(table.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsDisabled();
        table.pager.expectButtonNumbers([22, 23, 24, 25]);
        table.pager.expectButtonActive(5);

        // Remove 300 rows
        table.dataTableComponent.data = table.tableData.slice(300);
        table.fixture.detectChanges();
        tick();

        // Check button states for last page have changed
        expect(table.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.pager.expectLeadingButtonsNotDisabled();
        table.pager.expectTrailingButtonsDisabled();
        table.pager.expectButtonNumbers([7, 8, 9, 10]);
        table.pager.expectButtonActive(5);
    }));
});