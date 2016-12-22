import {Component, Input} from '@angular/core';

export let $: any;

@Component({
    moduleId: module.id,
    selector: 'download-menu',
    template: `
<div class="dropdown pull-right">
    <button class="btn btn-sm btn-default dropdown-toggle" 
            type="button" id="dropdownMenu1" data-toggle="dropdown" 
            aria-haspopup="true" aria-expanded="false" >
        <i class="fa fa-download" aria-hidden="true"></i> Download
        <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
        <li><a (click)="downloadAsCsv()">As CSV file</a></li>
    </ul>
</div>
`,
    styleUrls: ['common.component.css'],
    styles: ['.btn { margin-top: -4px }']
})
export class DownloadMenuComponent {

    @Input()
    public columns: string[];

    @Input()
    public data: any[];

    @Input()
    public filename: string;

    //noinspection JSUnusedGlobalSymbols
    public downloadAsCsv(): void {
        const processRow = function (row) {
            const keys = Object.keys(row);

            let finalVal = '';
            let first = true;
            for (let j = 0; j < keys.length; j++) {
                if ($.inArray(keys[j], this.columns) > -1) {
                    let innerValue = row[keys[j]] === null ? '' : row[keys[j]].toString();

                    if (row[keys[j]] instanceof Date) {
                        innerValue = row[keys[j]].toLocaleString();
                    }

                    let result = innerValue.replace(/"/g, '""');

                    if (result.search(/("|,|\n)/g) >= 0)
                        result = '"' + result + '"';

                    if (!first)
                        finalVal += ',';

                    first = false;
                    finalVal += result;
                }
            }
            return finalVal + '\n';
        };

        const createHeader = function (row) {
            const keys = Object.keys(row);
            let finalVal = '';
            let first = true;
            for (let j = 0; j < keys.length; j++) {
                if ($.inArray(keys[j], this.columns) > -1) {
                    const innerValue = keys[j] === null ? '' : keys[j].toString();
                    let result = innerValue.replace(/"/g, '""');
                    if (result.search(/("|,|\n)/g) >= 0)
                        result = '"' + result + '"';
                    if (!first)
                        finalVal += ',';
                    first = false;
                    finalVal += result;
                }
            }
            return finalVal + '\n';
        };

        let csvFile = '';

        if (this.data.length > 0) {
            csvFile += createHeader(this.data[0])
        }

        for (let i = 0; i < this.data.length; i++) {
            csvFile += processRow(this.data[i]);
        }

        const blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, this.filename);
        } else {
            const link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", this.filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
}