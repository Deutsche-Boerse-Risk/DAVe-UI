import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

import {TestBed, ComponentFixtureAutoDetect, async, ComponentFixture} from "@angular/core/testing";
import {click} from "../../testing/index";

import {DownloadMenuComponent} from "./download.menu.component";

describe('Download menu', () => {

    let comp: DownloadMenuComponent;
    let fixture: ComponentFixture<DownloadMenuComponent>;
    let de: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DownloadMenuComponent],
            providers: [
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DownloadMenuComponent);

        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('a'));

        // Generate testing data
        comp.columns = [
            {
                header: 'Column 1',
                get: (row: any) => row.col1
            },
            {
                header: 'Column 2',
                get: (row: any) => row.col2
            },
            {
                header: 'with\nnewline',
                get: (row: any) => row.col2
            },
            {
                header: 'with,comma',
                get: (row: any) => row.col2
            },
            {
                header: 'with"double quote',
                get: (row: any) => row.col2
            },
            {
                header: 'with space',
                get: (row: any) => row.col2
            }
        ];
        comp.data = [];
        for (let i = 0; i < 15; i++) {
            comp.data.push({
                col1: 'column1-row' + i,
                col2: 'column2-row' + i
            });
        }
        comp.data.push({
            col1: 'with\nnewline',
            col2: 'with,comma'
        });
        comp.data.push({
            col1: 'with"double quote',
            col2: 'with space'
        });
        comp.data.push({
            col1: 'with date',
            col2: new Date()
        });
        comp.filename = 'testFile';
        fixture.detectChanges();
    });

    it('generates a correct file once clicked', () => {
        let blobConstructor = Blob;
        let blobSpy = spyOn(window, 'Blob').and
            .callFake((blobParts?: any[], options?: BlobPropertyBag) => new blobConstructor(blobParts, options));
        let saveBlobSpy;
        if (navigator.msSaveBlob) { // IE 10+
            saveBlobSpy = spyOn(navigator, 'msSaveBlob');
        } else {
            saveBlobSpy = spyOn(document.body, 'appendChild');
            spyOn(document.body, 'removeChild');
            spyOn(HTMLAnchorElement.prototype, 'click');
        }

        click(de);
        fixture.detectChanges();

        expect(blobSpy.calls.mostRecent().args[0][0])
            .toContain(comp.columns[0].header + ',' + comp.columns[1].header + ',"'
                + comp.columns[2].header + '","' + comp.columns[3].header + '","'
                + comp.columns[4].header.replace(/"/g, '""') + '",' + comp.columns[5].header + '\n');

        expect(blobSpy.calls.mostRecent().args[0][0])
            .toContain(comp.data[0].col1 + ',' + comp.data[0].col2);
        expect(blobSpy.calls.mostRecent().args[0][0])
            .toContain(comp.data[7].col1 + ',' + comp.data[7].col2);
        expect(blobSpy.calls.mostRecent().args[0][0])
            .toContain(comp.data[14].col1 + ',' + comp.data[14].col2);

        expect(blobSpy.calls.mostRecent().args[0][0])
            .toContain('"' + comp.data[15].col1 + '","' + comp.data[15].col2 + '",');
        expect(blobSpy.calls.mostRecent().args[0][0])
            .toContain('"' + comp.data[16].col1.replace(/"/g, '""') + '",' + comp.data[16].col2);
        expect(blobSpy.calls.mostRecent().args[0][0])
            .toContain(comp.data[17].col1 + ','
                + (comp.data[17].col2.toLocaleString().search(/("|,|\n)/g) >= 0 ? '"' : '')
                + comp.data[17].col2.toLocaleString()
                + (comp.data[17].col2.toLocaleString().search(/("|,|\n)/g) >= 0 ? '"' : ''));

        expect(saveBlobSpy).toHaveBeenCalled();

        if (navigator.msSaveBlob) { // IE 10+
            expect(saveBlobSpy.calls.mostRecent().args[1]).toBe(comp.filename);
        } else {
            expect(saveBlobSpy.calls.mostRecent().args[0].getAttribute('download')).toBe(comp.filename);
        }
    });
});