import {AbstractListComponent} from './abstract.list.component';
import {ExportColumn} from './download.menu.component';

export abstract class AbstractLatestListComponent<T extends { uid: string }> extends AbstractListComponent<T> {

    public filterQuery: string;
    private _currentFilters: string[];

    private sourceData: T[];

    protected processData(data: T[]): void {
        super.processData(data);

        delete this.sourceData;
        this.sourceData = this.data;

        this.filter();
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
            this.data = this.sourceData;
        }

    }

    private matchObject(item: any, search: string): boolean {
        return this.exportKeys.some((key: ExportColumn<T>) => {
            let value = key.get(item);
            if (typeof value !== 'string') {
                return false;
            }
            return value.toLowerCase().indexOf(search) !== -1;
        });
    }
}