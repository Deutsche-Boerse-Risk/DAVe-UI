import {Component, Input} from '@angular/core';

export interface ExportColumn<T> {
    get: (row: T) => any;
    header: string;
}

@Component({
    moduleId: module.id,
    selector: 'download-menu',
    templateUrl: 'download.menu.component.html',
    styleUrls: ['download.menu.component.css']
})
export class DownloadMenuComponent {

    @Input()
    public columns: ExportColumn<any>[];

    @Input()
    public data: any[];

    @Input()
    public filename: string;

    public downloadAsCsv(): void {
        const processRow = (row: any) => {
            let finalVal = '';
            let first = true;
            this.columns.forEach((column: ExportColumn<any>) => {
                let value = column.get(row);
                let innerValue = !value ? '' : value.toString();

                if (value instanceof Date) {
                    innerValue = value.toLocaleString();
                }

                let result = innerValue.replace(/"/g, '""');

                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';

                if (!first)
                    finalVal += ',';

                first = false;
                finalVal += result;
            });
            return finalVal + '\n';
        };

        const createHeader = () => {
            let finalVal = '';
            let first = true;
            this.columns.forEach((column: ExportColumn<any>) => {
                const innerValue = !column.header ? '' : column.header.toString();
                let result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (!first)
                    finalVal += ',';
                first = false;
                finalVal += result;
            });
            return finalVal + '\n';
        };

        let csvFile = '';

        if (this.columns) {
            csvFile += createHeader();

            for (let i = 0; i < this.data.length; i++) {
                csvFile += processRow(this.data[i]);
            }
        }

        const blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, this.filename);
        } else {
            const link = document.createElement('a');
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', this.filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
}