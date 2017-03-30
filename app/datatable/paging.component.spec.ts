import {async, TestBed, fakeAsync} from '@angular/core/testing';

import {TestHostComponent, DataTableDefinitionHosted} from '../../testing';

import {DataTableModule} from './data.table.module';

describe('DataTable component shows pager', () => {

    let table: DataTableDefinitionHosted;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports     : [DataTableModule],
            declarations: [TestHostComponent]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        table = new DataTableDefinitionHosted(TestBed.createComponent(TestHostComponent));
        table.detectChanges();
    }));

    it('and correctly navigates to next page', fakeAsync(() => {
        expect(table.dataTable.pager.element).not.toBeNull('Is shown.');

        // Check button states for first page
        expect(table.dataTable.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.dataTable.pager.expectLeadingButtonsDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([1, 2, 3, 4]);
        table.dataTable.pager.expectButtonActive(2);

        // Go to next
        table.dataTable.pager.click(6);

        // Check button states
        expect(table.dataTable.pager.pageButtons.length).toBe(9, 'To display first and last two + 5 with numbers.');
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([1, 2, 3, 4, 5]);
        table.dataTable.pager.expectButtonActive(3);

        // Go to next
        table.dataTable.pager.click(7);

        // Check button states
        expect(table.dataTable.pager.pageButtons.length).toBe(10, 'To display first and last two + 6 with numbers.');
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([1, 2, 3, 4, 5, 6]);
        table.dataTable.pager.expectButtonActive(4);

        // Go to next
        table.dataTable.pager.click(8);

        // Check button states
        expect(table.dataTable.pager.pageButtons.length).toBe(11, 'To display first and last two + 7 with numbers.');
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([1, 2, 3, 4, 5, 6, 7]);
        table.dataTable.pager.expectButtonActive(5);

        // Go to next
        table.dataTable.pager.click(9);

        // Check button states
        expect(table.dataTable.pager.pageButtons.length).toBe(11, 'To display first and last two + 7 with numbers.');
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([2, 3, 4, 5, 6, 7, 8]);
        table.dataTable.pager.expectButtonActive(5);

        // Go to next
        table.dataTable.pager.click(8);

        // Check button states
        expect(table.dataTable.pager.pageButtons.length).toBe(11, 'To display first and last two + 7 with numbers.');
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([5, 6, 7, 8, 9, 10, 11]);
        table.dataTable.pager.expectButtonActive(5);
    }));

    it('and correctly navigates to previous page', fakeAsync(() => {
        expect(table.dataTable.pager.element).not.toBeNull('Is shown.');

        // Check button states for first page
        expect(table.dataTable.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.dataTable.pager.expectLeadingButtonsDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([1, 2, 3, 4]);
        table.dataTable.pager.expectButtonActive(2);

        // Go to last
        table.dataTable.pager.click(7);

        // Check button states for last page
        expect(table.dataTable.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsDisabled();
        table.dataTable.pager.expectButtonNumbers([22, 23, 24, 25]);
        table.dataTable.pager.expectButtonActive(5);

        // Go to previous
        table.dataTable.pager.click(1);

        // Check button states
        expect(table.dataTable.pager.pageButtons.length).toBe(9, 'To display first and last two + 5 with numbers.');
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([21, 22, 23, 24, 25]);
        table.dataTable.pager.expectButtonActive(5);

        // Go to previous
        table.dataTable.pager.click(1);

        // Check button states
        expect(table.dataTable.pager.pageButtons.length).toBe(10, 'To display first and last two + 6 with numbers.');
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([20, 21, 22, 23, 24, 25]);
        table.dataTable.pager.expectButtonActive(5);

        // Go to previous
        table.dataTable.pager.click(1);

        // Check button states
        expect(table.dataTable.pager.pageButtons.length).toBe(11, 'To display first and last two + 7 with numbers.');
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([19, 20, 21, 22, 23, 24, 25]);
        table.dataTable.pager.expectButtonActive(5);

        // Go to previous
        table.dataTable.pager.click(1);

        // Check button states
        expect(table.dataTable.pager.pageButtons.length).toBe(11, 'To display first and last two + 7 with numbers.');
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([18, 19, 20, 21, 22, 23, 24]);
        table.dataTable.pager.expectButtonActive(5);
    }));

    it('and correctly navigates to first and last page', fakeAsync(() => {
        expect(table.dataTable.pager.element).not.toBeNull('Is shown.');

        // Check button states for first page
        expect(table.dataTable.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.dataTable.pager.expectLeadingButtonsDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([1, 2, 3, 4]);
        table.dataTable.pager.expectButtonActive(2);

        // Go to some page
        table.dataTable.pager.click(5);

        // Check button states
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([1, 2, 3, 4, 5, 6, 7]);
        table.dataTable.pager.expectButtonActive(5);

        // Go to first
        table.dataTable.pager.click(0);

        // Check button states for first page
        expect(table.dataTable.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.dataTable.pager.expectLeadingButtonsDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([1, 2, 3, 4]);
        table.dataTable.pager.expectButtonActive(2);

        // Go to last
        table.dataTable.pager.click(7);

        // Check button states for last page
        expect(table.dataTable.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsDisabled();
        table.dataTable.pager.expectButtonNumbers([22, 23, 24, 25]);
        table.dataTable.pager.expectButtonActive(5);

        // Go to first
        table.dataTable.pager.click(0);

        // Check button states for first page
        expect(table.dataTable.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.dataTable.pager.expectLeadingButtonsDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([1, 2, 3, 4]);
        table.dataTable.pager.expectButtonActive(2);

    }));

    it('and correctly changes page size whenever data size is changed', fakeAsync(() => {
        expect(table.dataTable.pager.element).not.toBeNull('Is shown.');

        // Check button states for first page
        expect(table.dataTable.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.dataTable.pager.expectLeadingButtonsDisabled();
        table.dataTable.pager.expectTrailingButtonsNotDisabled();
        table.dataTable.pager.expectButtonNumbers([1, 2, 3, 4]);
        table.dataTable.pager.expectButtonActive(2);

        // Go to last page
        table.dataTable.pager.click(7);

        // Check button states for last page
        expect(table.dataTable.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsDisabled();
        table.dataTable.pager.expectButtonNumbers([22, 23, 24, 25]);
        table.dataTable.pager.expectButtonActive(5);

        // Remove 300 rows
        table.dataTable.component.data = table.dataTable.data.slice(300);
        table.detectChanges();

        // Check button states for last page have changed
        expect(table.dataTable.pager.pageButtons.length).toBe(8, 'To display first and last two + 4 with numbers.');
        table.dataTable.pager.expectLeadingButtonsNotDisabled();
        table.dataTable.pager.expectTrailingButtonsDisabled();
        table.dataTable.pager.expectButtonNumbers([7, 8, 9, 10]);
        table.dataTable.pager.expectButtonActive(5);
    }));
});