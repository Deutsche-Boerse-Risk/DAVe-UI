import {Component, EventEmitter, Output, Input} from '@angular/core';

import {RoutePart} from './bread.crumbs.component';

@Component({
    moduleId: module.id,
    selector: 'list-content',
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.css']
})
export class ListComponent {

    @Input()
    public title: string;

    @Input()
    public isHistory: boolean = false;

    @Input()
    public routeParts: RoutePart[];

    @Input()
    public exportKeys: string[];

    @Input()
    public data: any[];

    @Output()
    public filterChanged: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    public initialLoad: boolean;

    @Input()
    public drilldownRouterLink: any[] | string;

    @Input()
    public errorMessage: string;

    public filterQuery: string;

    private filterTimeoutHandle: NodeJS.Timer;

    public filterAfterTimeout(): void {
        clearTimeout(this.filterTimeoutHandle);
        this.filterTimeoutHandle = setTimeout(() => {
            this.filterChanged.emit(this.filterQuery);
        }, 100);
    }
}