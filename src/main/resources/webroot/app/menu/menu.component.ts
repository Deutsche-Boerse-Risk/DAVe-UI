import {Component, ElementRef} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";

import {AbstractComponent} from "../abstract.component";

@Component({
    moduleId: module.id,
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.css']
})
export class MenuComponent extends AbstractComponent {

    public tss: any[];

    constructor(router: Router,
                route: ActivatedRoute,
                el: ElementRef) {
        super(router, route, el);
    }

}