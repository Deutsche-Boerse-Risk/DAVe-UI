import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'row-filter',
    template: `
<div class="pull-right col-lg-2 filter">
    <div class="input-group input-group-sm">
        <input type="text" class="form-control"
               placeholder="Filter ..." [(ngModel)]="filterQuery"
               (ngModelChange)="filterAfterTimeout()">
        <span class="input-group-btn">
            <button class="btn btn-default" type="button" (click)="filter()">
                <i class="fa fa-search" aria-hidden="true"></i>
            </button>
        </span>
    </div>
</div>
`,
    styleUrls: ['download.menu.component.css']
})
export class FilterComponent {

    public filterQuery: string;

    private filterTimeoutHandle: NodeJS.Timer;

    @Output()
    public filterChanged: EventEmitter<string> = new EventEmitter<string>();

    public filterAfterTimeout() {
        clearTimeout(this.filterTimeoutHandle);
        this.filterTimeoutHandle = setTimeout(() => {
            this.filterChanged.emit(this.filterQuery);
        }, 100);
    }
}