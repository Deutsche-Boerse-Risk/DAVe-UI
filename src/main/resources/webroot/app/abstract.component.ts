import {Router, ActivatedRoute} from "@angular/router";
import {ElementRef} from "@angular/core";

export class AbstractComponent {

    constructor(protected router: Router,
                protected route: ActivatedRoute,
                protected el: ElementRef) {
    }
}