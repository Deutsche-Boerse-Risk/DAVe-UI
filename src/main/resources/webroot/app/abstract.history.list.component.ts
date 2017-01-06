import {AbstractListComponent} from './abstract.list.component';

export abstract class AbstractHistoryListComponent<T> extends AbstractListComponent<T> {

    public chartData: any[];

    protected processData(data: T[]): void {
        super.processData(data);

        let chartData = [];

        for (let index = 0; index < data.length; ++index) {
            chartData.push(this.getTickFromRecord(data[index]));
        }
        this.chartData = chartData;
    }

    protected abstract getTickFromRecord(record: T): any;
}