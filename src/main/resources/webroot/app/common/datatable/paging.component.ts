import {Component, Input, Output, OnChanges, SimpleChanges, EventEmitter} from "@angular/core";

@Component({
    moduleId: module.id,
    selector: 'paging',
    templateUrl: 'paging.component.html',
    styleUrls: ['../common.component.css']
})
export class PagingComponent implements OnChanges {

    public pages: number[];

    public currentPage: number = 1;

    @Input()
    public pageSize: number;

    @Input()
    public totalRecords: number;

    public lastPage: number;

    @Output()
    public pageChanged: EventEmitter<number> = new EventEmitter<number>();

    public ngOnChanges(changes: SimpleChanges): void {
        if (!this.pageSize || this.pageSize) {
            return;
        }

        this.lastPage = Math.ceil(this.totalRecords / this.pageSize);

        if (this.currentPage > this.lastPage) {
            this.goToPage(this.lastPage);
        } else {
            this.goToPage(this.currentPage)
        }
    }

    public goToPage(page: number) {
        this.pages = [];
        if (page > 3) {
            this.pages.push(page - 3);
        }
        if (page > 2) {
            this.pages.push(page - 2);
        }
        if (page > 1) {
            this.pages.push(page - 1);
        }

        this.pages.push(page);

        if (page < this.lastPage) {
            this.pages.push(page + 1);
        }
        if (page < this.lastPage - 1) {
            this.pages.push(page + 2);
        }
        if (page < this.lastPage - 2) {
            this.pages.push(page + 3);
        }

        if (this.currentPage === page) {
            return;
        }

        this.currentPage = page;
        this.pageChanged.emit(this.currentPage);
    }
}