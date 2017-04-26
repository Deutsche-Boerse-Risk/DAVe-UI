import {Directive} from '@angular/core';

import {selector} from './data.table.row.detail.expander.component';

@Directive({
    selector: '[expandable]',
    exportAs: 'expandable'
})
export class DataTableExpandableDirective {

    public expand(masterRow: HTMLElement, enabled: boolean): void {
        if (!enabled) {
            return;
        }
        let extraIcon: Element = masterRow.querySelector(selector + ' .mat-icon');
        let detailTable: Element = masterRow.nextElementSibling;
        if (detailTable.classList.contains('hidden')) {
            detailTable.classList.remove('hidden');
            extraIcon.textContent = 'expand_less';
        }
        else {
            detailTable.classList.add('hidden');
            extraIcon.textContent = 'expand_more';
        }
    }
}