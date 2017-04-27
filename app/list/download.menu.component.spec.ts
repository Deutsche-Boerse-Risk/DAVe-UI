import {DatePipe} from '@angular/common';
import {TestBed, async, fakeAsync, inject} from '@angular/core/testing';

import {DownloadMenuPage} from '../../testing';

import {DateFormatter, DATE_FORMAT} from '../common/common.module';

import {DownloadMenuComponent} from './download.menu.component';

xdescribe('Download menu', () => {

    let page: DownloadMenuPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DownloadMenuComponent],
            providers   : [
                DatePipe,
                DateFormatter,
                {
                    provide : DATE_FORMAT,
                    useValue: 'dd. MM. yyyy HH:mm:ss'
                }
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        page = new DownloadMenuPage(TestBed.createComponent(DownloadMenuComponent));

        // Generate testing data
        page.component.columns = [
            {
                header: 'Column 1',
                get   : (row: any) => row.col1
            },
            {
                header: 'Column 2',
                get   : (row: any) => row.col2
            },
            {
                header: 'with\nnewline',
                get   : (row: any) => row.col2
            },
            {
                header: 'with,comma',
                get   : (row: any) => row.col2
            },
            {
                header: 'with"double quote',
                get   : (row: any) => row.col2
            },
            {
                header: 'with space',
                get   : (row: any) => row.col2
            }
        ];
        page.component.data = [];
        for (let i = 0; i < 15; i++) {
            page.component.data.push({
                col1: 'column1-row' + i,
                col2: 'column2-row' + i
            });
        }
        page.component.data.push({
            col1: 'with\nnewline',
            col2: 'with,comma'
        });
        page.component.data.push({
            col1: 'with"double quote',
            col2: 'with space'
        });
        page.component.data.push({
            col1: 'with date',
            col2: new Date()
        });
        page.component.filename = 'testFile';
        page.detectChanges();
    }));

    it('generates a correct file once clicked', fakeAsync(inject([DateFormatter], (dateFormatter: DateFormatter) => {
        let downloadLink = page.downloadLink;
        downloadLink.click();

        let exportedData = downloadLink.blobSpy.calls.mostRecent().args[0][0];
        expect(exportedData).toContain(page.component.columns[0].header + ',' + page.component.columns[1].header + ',"'
            + page.component.columns[2].header + '","' + page.component.columns[3].header + '","'
            + page.component.columns[4].header.replace(/"/g,
                '""') + '",' + page.component.columns[5].header
            + '\n');

        expect(exportedData).toContain(page.component.data[0].col1 + ',' + page.component.data[0].col2);
        expect(exportedData).toContain(page.component.data[7].col1 + ',' + page.component.data[7].col2);
        expect(exportedData).toContain(page.component.data[14].col1 + ',' + page.component.data[14].col2);

        expect(exportedData)
            .toContain('"' + page.component.data[15].col1 + '","' + page.component.data[15].col2 + '",');
        expect(exportedData).toContain('"' + page.component.data[16].col1.replace(/"/g, '""') + '",'
            + page.component.data[16].col2);
        let dateString = dateFormatter.transform(page.component.data[17].col2 as Date);
        expect(exportedData).toContain(page.component.data[17].col1 + ','
            + (dateString.search(/([",\n])/g) >= 0 ? '"' : '')
            + dateString
            + (dateString.search(/([",\n])/g) >= 0 ? '"' : ''));

        expect(downloadLink.saveSpy).toHaveBeenCalled();
        expect(downloadLink.saveSpy.calls.mostRecent().args[1]).toBe(page.component.filename);
    })));
});