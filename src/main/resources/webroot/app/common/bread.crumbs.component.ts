import {Component, Input} from '@angular/core';

export interface RoutePart {
    title: string;
    routePart: string;
}

@Component({
    moduleId: module.id,
    selector: 'bread-crumbs',
    template: `
<a *ngIf="routeParts?.length > 0" [routerLink]="getRoute(0)">{{routeParts[0].title}}</a>
<span *ngIf="routeParts?.length > 1">: <a routerLink="getRoute(1)">{{routeParts[1].title}}</a></span>
<template [ngIf]="routeParts?.length > 2"> 
    <span *ngFor="let route of getAdditionalRoutes()"> / <a routerLink="getRoute(route)">{{routeParts[route].title}}</a></span>
</template>
`,
    styleUrls: ['common.component.css']
})
export class BreadCrumbsComponent {

    @Input()
    public routeParts: RoutePart[];

    public getRoute(index: number): string[] {
        const items: string[] = [];
        for (let i = 0; i <= index; i++) {
            items.push(this.routeParts[i].routePart);
        }
        return items;
    }

    public getAdditionalRoutes(): number[] {
        const items: number[] = [];
        for (let i = 2; i < this.routeParts.length; i++) {
            items.push(i);
        }
        return items;
    }
}