import {
    Component, Input, Output, OnChanges, EventEmitter, SimpleChanges, ContentChildren,
    QueryList
} from '@angular/core';
import {MdButtonToggle} from '@angular/material';

@Component({
    moduleId   : module.id,
    selector   : 'paging',
    templateUrl: 'paging.component.html',
    styleUrls  : [
        '../component.css',
        'paging.component.css'
    ]
})
export class PagingComponent implements OnChanges {

    @ContentChildren(MdButtonToggle)
    public _buttons: QueryList<MdButtonToggle>;

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
        if (!this.pageSize || this.pageSize < 1) {
            return;
        }

        this.lastPage = Math.ceil(this.totalRecords / this.pageSize);

        setTimeout(() => {
            if (this.currentPage > this.lastPage) {
                this.goToPage(this.lastPage);
            } else {
                this.goToPage(this.currentPage);
            }
        }, 0);
    }

    public goToPage(page: number): void {
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

        this.pageChanged.emit(page);

        setTimeout(() => {
            this.currentPage = page;
        });
    }

    public trackByPage(index: number, value: number): number {
        return value;
    }
}