import {Directive, TemplateRef} from '@angular/core';

@Directive({
    selector: '[cell-template]'
})
export class DataTableColumnCellDirective {

    constructor(public template: TemplateRef<any>) {
    };
}