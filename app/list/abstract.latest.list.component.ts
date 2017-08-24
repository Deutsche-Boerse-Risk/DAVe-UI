import {DecimalPipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

import {CSVExportColumn} from '@dbg-riskit/dave-ui-file';
import {DateFormatter} from '@dbg-riskit/dave-ui-view';

import {AbstractListComponent} from './abstract.list.component';

export abstract class AbstractLatestListComponent<T extends { uid: string }> extends AbstractListComponent<T> {

    public filterQuery: string;
    private _currentFilters: string[];

    private sourceData: T[];

    constructor(route: ActivatedRoute, private dateFormatter: DateFormatter, private numberFormatter: DecimalPipe) {
        super(route);
    }

    protected processData(data: T[]): void {
        super.processData(data);

        delete this.sourceData;
        this.sourceData = this.data;

        let filterQuery = (this._currentFilters || []).join(' ');
        this._currentFilters = null;

        this.filter(filterQuery);
    }

    public filter(filterQuery?: string): void {
        if (filterQuery || filterQuery === '') {
            this.filterQuery = filterQuery;
        }

        if (this.filterQuery) {
            let filters: string[] = this.filterQuery.toLowerCase().split(' ')
                .filter((filter: string) => filter.trim() !== '');
            if (this._currentFilters && !filters.some(
                    (filter: string) => this._currentFilters.indexOf(filter) === -1)) {
                return;
            }
            this._currentFilters = filters;

            let index: number;
            let index2: number;
            let filteredItems: T[] = [];

            for (index = 0; index < this.sourceData.length; index++) {
                let match = true;

                for (index2 = 0; index2 < this._currentFilters.length; index2++) {
                    if (!this.matchObject(this.sourceData[index], this._currentFilters[index2])) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    filteredItems.push(this.sourceData[index]);
                }
            }

            this.data = filteredItems;
        }
        else {
            this._currentFilters = null;
            this.data = this.sourceData;
        }

    }

    public matchObject(item: any, search: string): boolean {
        return this.exportKeys.some((key: CSVExportColumn<T>) => {
            let value = key.get(item);
            if (typeof value === 'number') {
                value = this.numberFormatter.transform(value, '.0-0');
            }
            if (value instanceof Date) {
                value = this.dateFormatter.transform(value);
            }
            if (typeof value !== 'string') {
                return false;
            }

            return value.toLowerCase().indexOf((search || '').toLowerCase()) !== -1;
        });
    }
}