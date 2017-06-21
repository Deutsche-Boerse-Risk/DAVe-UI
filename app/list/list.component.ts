import {Component, EventEmitter, Input, Output} from '@angular/core';

import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-common';
import {DataTableComponent, Row} from '@dbg-riskit/dave-ui-datatable';

import {RoutePart} from './bread.crumbs.component';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';

export const FILTER_TIMEOUT = 500;

@Component({
    moduleId   : module.id,
    selector   : 'list-content',
    templateUrl: 'list.component.html',
    styleUrls  : [
        '../../' + COMPONENT_CSS,
        'list.component.css'
    ]
})
export class ListComponent {

    @Input('header')
    public title: string;

    @Input()
    public isHistory: boolean = false;

    @Input()
    public routeParts: RoutePart[];

    @Input()
    public exportKeys: string[];

    @Input()
    public dataTable: DataTableComponent;

    @Output()
    public filterChanged: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    public initialLoad: boolean;

    @Input()
    public drilldownRouterLink: any[] | string;

    @Input()
    public drillupRouterLink: any[] | string;

    public filterQuery: string;

    private filterTimeoutHandle: NodeJS.Timer;

    public get exportData(): Observable<any[]> {
        return new Observable((subscriber: Subscriber<any[]>) => {
            setTimeout(() => {
                let rows = this.dataTable ? this.dataTable.rows : [];
                subscriber.next(rows.map((row: Row<any>) => row.rowData));
                subscriber.complete();
            });
        });
    }

    public filterAfterTimeout(): void {
        clearTimeout(this.filterTimeoutHandle);
        this.filterTimeoutHandle = setTimeout(() => {
            this.filter();
        }, FILTER_TIMEOUT);
    }

    public filter(): void {
        this.filterChanged.emit(this.filterQuery);
    }
}