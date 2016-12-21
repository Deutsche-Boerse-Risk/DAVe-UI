import {Router, ActivatedRoute} from "@angular/router";
import {ElementRef} from "@angular/core";

export abstract class AbstractComponent {

    constructor(protected router: Router,
                protected route: ActivatedRoute,
                protected el: ElementRef) {
    }
}