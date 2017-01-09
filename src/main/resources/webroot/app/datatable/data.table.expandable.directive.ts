import {Directive} from '@angular/core';

import {selector} from './data.table.row.detail.expander.component';

@Directive({
    selector: '[expandable]',
    exportAs: 'expandable'
})
export class DataTableExpandableDirective {

    constructor() {
    };

    public expand(masterRow: HTMLElement, enabled: boolean): void {
        if (!enabled) {
            return;
        }
        let extraIcon: Element = masterRow.querySelector(selector + ' .fa');
        let detailTable: Element = masterRow.nextElementSibling;
        if (detailTable.classList.contains('hidden')) {
            detailTable.classList.remove('hidden');
            extraIcon.classList.remove('fa-chevron-circle-down');
            extraIcon.classList.add('fa-chevron-circle-up');
        }
        else {
            detailTable.classList.add('hidden');
            extraIcon.classList.remove('fa-chevron-circle-up');
            extraIcon.classList.add('fa-chevron-circle-down');
        }
    }
}