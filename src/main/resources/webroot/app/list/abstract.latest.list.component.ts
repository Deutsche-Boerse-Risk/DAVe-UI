import {AbstractListComponent} from './abstract.list.component';

export abstract class AbstractLatestListComponent<T> extends AbstractListComponent<T> {

    public filterQuery: string;

    private sourceData: T[];

    protected processData(data: T[]): void {
        super.processData(data);

        this.sourceData = this.data;

        this.filter();
    }

    public filter(filterQuery?: string): void {
        if (filterQuery || filterQuery === '') {
            this.filterQuery = filterQuery;
        }

        if (this.filterQuery) {
            let filters: string[] = this.filterQuery.toLowerCase().split(' ');
            let index: number;
            let index2: number;
            let filteredItems: T[] = [];

            for (index = 0; index < this.sourceData.length; index++) {
                let match = true;

                for (index2 = 0; index2 < filters.length; index2++) {
                    if (!MatchObject(this.sourceData[index], filters[index2])) {
                        match = false;
                        break;
                    }
                }

                if (match == true) {
                    filteredItems.push(this.sourceData[index]);
                }
            }

            this.data = filteredItems;
        }
        else {
            this.data = this.sourceData;
        }

        function MatchObject(item: any, search: string): boolean {
            return Object.keys(item).some((key: string) => {
                return String(item[key]).toLowerCase().indexOf(search) !== -1;
            });
        }
    }
}