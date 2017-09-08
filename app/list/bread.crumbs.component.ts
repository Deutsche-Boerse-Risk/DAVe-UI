import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';

import {COMPONENT_CSS} from '@dbg-riskit/dave-ui-devkit';

export interface RoutePart {
    title: string;
    routePart: string;
    index?: number;
}

@Component({
    moduleId       : module.id,
    selector       : 'bread-crumbs',
    templateUrl    : 'bread.crumbs.component.html',
    styleUrls      : [
        '../../' + COMPONENT_CSS,
        'bread.crumbs.component.css'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadCrumbsComponent implements OnChanges {

    @Input()
    public routeParts: RoutePart[];

    public filteredRouteParts: RoutePart[];

    constructor(private router: Router) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.routeParts) {
            this.filterParts();
        }
    }

    private filterParts() {
        this.filteredRouteParts = this.routeParts.filter((part: RoutePart, index: number) => {
            part.index = index;
            return part.title !== '*';
        });
    }

    public navigate(part: RoutePart): void {
        part.routePart = '*';
        this.router.navigate(this.getRoute());
    }

    private getRoute(): string[] {
        const items: string[] = [];
        for (let i = 0; i < this.routeParts.length; i++) {
            items.push(this.routeParts[i].routePart);
        }
        return items;
    }

    public trackByIndex(index: number, routePart: RoutePart): number {
        return routePart.index;
    }
}