import {Directive, TemplateRef} from '@angular/core';

@Directive({
    selector: '[row-detail]'
})
export class DataTableRowDetailDirective {

    constructor(public template: TemplateRef<any>) {
    }

}