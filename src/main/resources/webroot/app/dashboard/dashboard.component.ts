import {Router, ActivatedRoute} from "@angular/router";
import {ElementRef, Component} from "@angular/core";

import {AbstractComponent} from "../abstract.component";

@Component({
    moduleId: module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent extends AbstractComponent {

    private _activeTab: string = 'overview';

    constructor(router: Router,
                route: ActivatedRoute,
                el: ElementRef) {
        super(router, route, el);
    }

    public get activeTab(): string {
        return this._activeTab;
    }

    public setActiveTab(tab: string): void {
        this._activeTab = tab;
    }
}