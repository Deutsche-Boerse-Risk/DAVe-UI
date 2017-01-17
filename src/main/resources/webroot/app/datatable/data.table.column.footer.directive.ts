import {Directive, TemplateRef} from '@angular/core';

@Directive({
    selector: '[footer-template]'
})
export class DataTableColumnFooterDirective {

    constructor(public template: TemplateRef<{footer: any}>) {
    };
}