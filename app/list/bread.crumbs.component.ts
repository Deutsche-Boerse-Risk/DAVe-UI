import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';

export interface RoutePart {
    title: string;
    routePart: string;
    index?: number;
    inactive?: boolean;
}

@Component({
    moduleId   : module.id,
    selector   : 'bread-crumbs',
    templateUrl: 'bread.crumbs.component.html',
    styleUrls  : [
        '../component.css',
        'bread.crumbs.component.css'
    ]
})
export class BreadCrumbsComponent implements OnChanges {

    @Input()
    public routeParts: RoutePart[];

    public filteredRouteParts: RoutePart[];

    constructor(private router: Router) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.routeParts) {
            this.filteredRouteParts = this.routeParts.filter((part: RoutePart, index: number) => {
                part.index = index;
                return part.title !== '*';
            });
        }
    }

    public navigate(part: RoutePart): void {
        if (!part.inactive) {
            this.router.navigate(this.getRoute(part));
        }
    }

    private getRoute(part: RoutePart): string[] {
        let index = part.index;
        const items: string[] = [];
        for (let i = 0; i <= index; i++) {
            items.push(this.routeParts[i].routePart);
        }
        return items;
    }

    public trackByIndex(index: number, routePart: RoutePart): number {
        return routePart.index;
    }
}