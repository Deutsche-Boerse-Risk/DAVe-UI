import {NO_ERRORS_SCHEMA, DebugElement} from "@angular/core";
import {By, BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";

import {ComponentFixture, async, TestBed, fakeAsync, tick, inject} from "@angular/core/testing";

import {click, advance, setNgModelSelectValue} from "../../testing/index";
import {RouterLinkStubDirective} from "../../testing/router.link.stub";
import {HttpAsyncServiceStub} from "../../testing/http.service.stub";
import {generatePositionReports} from "../../testing/mock/position.reports.generator";

import {HttpService} from "../http.service";
import {PositionReportsService} from "./position.reports.service";

import {
    PositionReportBubbleChartComponent, compVarPositiveLegend, compVarNegativeLegend
} from "./position.report.bubblechart.component";
import {PositionReportServerData, PositionReportBubble} from "./position.report.types";
import {ChartRow} from "../common/chart.types";

describe('Position reports bubble chart component', () => {
    let page: BubbleChartPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                FormsModule
            ],
            declarations: [
                PositionReportBubbleChartComponent,
                RouterLinkStubDirective
            ],
            providers: [
                PositionReportsService,
                {
                    provide: HttpService, useClass: HttpAsyncServiceStub
                }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
        // Generate test data
        http.returnValue(generatePositionReports());
        // Create component
        page = new BubbleChartPage(TestBed.createComponent(PositionReportBubbleChartComponent));
    })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
            // Init component
            page.fixture.detectChanges();
            tick();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadVisible).toBeTruthy('Initial load component visible.');
            expect(page.noDataVisible).toBeFalsy('No data component not visible.');
            expect(page.updateFailedVisible).toBeFalsy('Update failed component not visible.');
            expect(page.googleChartVisible).toBeFalsy('Chart component not visible.');

            // Return error
            http.throwError({
                status: 500,
                message: 'Error message'
            });
            advance(page.fixture, 1000);
            tick();

            expect(page.initialLoadVisible).toBeFalsy('Initial load component not visible.');
            expect(page.noDataVisible).toBeFalsy('No data component not visible.');
            expect(page.updateFailedVisible).toBeTruthy('Update failed component visible.');
            expect(page.googleChartVisible).toBeFalsy('Chart component not visible.');
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
            // Init component
            page.fixture.detectChanges();
            tick();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadVisible).toBeTruthy('Initial load component visible.');
            expect(page.noDataVisible).toBeFalsy('No data component not visible.');
            expect(page.updateFailedVisible).toBeFalsy('Update failed component not visible.');
            expect(page.googleChartVisible).toBeFalsy('Chart component not visible.');

            // Return no data
            http.popReturnValue(); // Remove from queue
            http.returnValue([]); // Push empty array
            advance(page.fixture, 1000);
            tick();

            expect(page.initialLoadVisible).toBeFalsy('Initial load component not visible.');
            expect(page.noDataVisible).toBeTruthy('No data component visible.');
            expect(page.updateFailedVisible).toBeFalsy('Update failed component not visible.');
            expect(page.googleChartVisible).toBeFalsy('Chart component not visible.');
        })));

    it('displays chart correctly', fakeAsync(() => {
        // Init component
        page.fixture.detectChanges();
        tick();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);

        expect(page.initialLoadVisible).toBeTruthy('Initial load component visible.');
        expect(page.noDataVisible).toBeFalsy('No data component not visible.');
        expect(page.updateFailedVisible).toBeFalsy('Update failed component not visible.');
        expect(page.googleChartVisible).toBeFalsy('Chart component not visible.');

        // Return data
        advance(page.fixture, 1000);
        tick();

        expect(page.initialLoadVisible).toBeFalsy('Initial load component not visible.');
        expect(page.noDataVisible).toBeFalsy('No data component not visible.');
        expect(page.updateFailedVisible).toBeFalsy('Update failed component not visible.');
        expect(page.googleChartVisible).toBeTruthy('Chart component visible.');
    }));

    it('selection works correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<PositionReportServerData[]>) => {
            // Init component
            page.fixture.detectChanges();
            tick();

            // Return data
            advance(page.fixture, 1000);
            tick();

            page.expectStatesMatch('A', 'A', 20);

            page.selectMember(1);
            page.expectStatesMatch('B', 'A', 20);

            page.selectAccount(1);
            page.expectStatesMatch('B', 'B', 20);

            page.selectMember(0);
            page.expectStatesMatch('A', 'A', 20);


            page.selectMember(1);
            page.selectAccount(1);
            page.selectBubblesCount(2);
            page.expectStatesMatch('B', 'B', 30);

            // Generate new data
            http.returnValue(generatePositionReports());
            // Trigger auto refresh
            tick(60000);
            page.fixture.detectChanges();
            tick();
            page.expectStatesMatch('B', 'B', 30);

            // Generate new data
            http.returnValue(generatePositionReports(2, 1));
            // Trigger auto refresh
            tick(60000);
            page.fixture.detectChanges();
            tick();
            page.expectStatesMatch('B', 'A', 30);

            // Generate new data
            http.returnValue(generatePositionReports(1));
            // Trigger auto refresh
            tick(60000);
            page.fixture.detectChanges();
            tick();
            page.expectStatesMatch('A', 'A', 30);

            // Trigger auto refresh with no data
            tick(60000);
            page.fixture.detectChanges();
            tick();
            page.expectStatesMatch(undefined, undefined, 30);

            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);
        })));

    it('detail links navigates', fakeAsync(() => {
        // Init component
        page.fixture.detectChanges();
        tick();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);


        //Does not exists, yet
        expect(() => click(page.viewDetails)).toThrow();

        // Return data
        advance(page.fixture, 1000);
        tick();

        // Already shown
        let navigateSpy = spyOn(page.viewDetailsStub, 'onClick').and.callThrough();
        expect(() => click(page.viewDetails)).not.toThrow();

        // Clicked correctly
        expect(navigateSpy).toHaveBeenCalled();
        expect(page.viewDetailsStub.navigatedTo).toEqual('/positionReportLatest');
    }));

    it('check data', fakeAsync(() => {
        // Init component
        page.fixture.detectChanges();
        tick();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);
        // Return data
        advance(page.fixture, 1000);
        tick();

        page.matchTitle('20', '10,800.00%', '20', '66.67%', '0.00');
        expect(page.component.chartData.rows.length).toEqual(7);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(5);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(2);

        page.selectMember(1);

        page.matchTitle('20', '21,600.00%', '20', '66.67%', '0.00');
        page.expectStatesMatch('B', 'A', 20);
        expect(page.component.chartData.rows.length).toEqual(7);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(5);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(2);

        page.selectAccount(1);

        page.matchTitle('20', '0.00%', '20', '0.00%', '0.00');
        page.expectStatesMatch('B', 'B', 20);
        expect(page.component.chartData.rows.length).toEqual(8);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(8);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(0);

        page.selectAccount(2);
        page.selectBubblesCount(2);

        page.matchTitle('30', '10,800.00%', '30', '66.67%', '0.00');
        page.expectStatesMatch('B', 'C', 30);

        expect(page.component.chartData.rows.length).toEqual(7);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarPositiveLegend;
        }).length).toEqual(5);
        expect(page.component.chartData.rows.filter((row: ChartRow) => {
            return row.c[3].v === compVarNegativeLegend;
        }).length).toEqual(2);
    }));
});

class BubbleChartPage {

    public component: PositionReportBubbleChartComponent;
    public debugElement: DebugElement;

    constructor(public fixture: ComponentFixture<PositionReportBubbleChartComponent>) {
        this.component = this.fixture.componentInstance;
        this.debugElement = this.fixture.debugElement;
    }

    public get memberSelect(): DebugElement {
        return this.debugElement.query(By.css('[id="memberSelect"]'));
    }

    public selectMember(index: number): void {
        setNgModelSelectValue(this.memberSelect, index);
        this.fixture.detectChanges();
        tick();
    };

    public get memberSelectionOptions(): PositionReportBubble[] {
        return this.component.sourceData.selection.getOptions();
    }

    public get memberSelectValue(): string {
        let selectedIndex = (this.memberSelect.nativeElement as HTMLSelectElement).selectedIndex;
        if (selectedIndex === -1) {
            return undefined;
        }
        return this.memberSelectionOptions[(this.memberSelect.nativeElement as HTMLSelectElement).selectedIndex].member;
    }

    public get accountSelect(): DebugElement {
        return this.debugElement.query(By.css('[id="accountSelect"]'));
    }

    public selectAccount(index: number): void {
        setNgModelSelectValue(this.accountSelect, index);
        this.fixture.detectChanges();
        tick();
    };

    public get accountSelectionOptions(): PositionReportBubble[] {
        return this.component.sourceData.selection.get(this.component.sourceData.memberSelection.memberKey)
            .subRecords.getOptions();
    }

    public get accountSelectValue(): string {
        let selectedIndex = (this.accountSelect.nativeElement as HTMLSelectElement).selectedIndex;
        if (selectedIndex === -1) {
            return undefined;
        }
        return this.accountSelectionOptions[selectedIndex].account;
    }

    public get bubblesCount(): DebugElement {
        return this.debugElement.query(By.css('[id="bubblesCount"]'));
    }

    public selectBubblesCount(index: number): void {
        setNgModelSelectValue(this.bubblesCount, index);
        this.fixture.detectChanges();
        tick();
    };

    public get bubblesCountValue(): number {
        let selectedIndex = (this.bubblesCount.nativeElement as HTMLSelectElement).selectedIndex;
        if (selectedIndex === -1) {
            return undefined;
        }
        return this.component.topRecords[(this.bubblesCount.nativeElement as HTMLSelectElement).selectedIndex];
    }

    public get initialLoadVisible(): boolean {
        return this.debugElement.query(By.css('initial-load')) !== null;
    }

    public get noDataVisible(): boolean {
        return this.debugElement.query(By.css('no-data')) !== null;
    }

    public get updateFailedVisible(): boolean {
        return this.debugElement.query(By.css('update-failed')) !== null;
    }

    public get googleChartVisible(): boolean {
        return this.debugElement.query(By.css('google-chart')) !== null;
    }

    public get viewDetails(): DebugElement {
        return this.debugElement.query(By.directive(RouterLinkStubDirective));
    }

    public get viewDetailsStub(): RouterLinkStubDirective {
        return this.debugElement.query(By.directive(RouterLinkStubDirective)).injector.get(RouterLinkStubDirective);
    }

    public expectStatesMatch(member: string, account: string, records: number) {
        expect(this.memberSelectValue).toBe(member);
        if (this.component.sourceData.memberSelection) {
            expect(this.memberSelectValue).toBe(this.component.sourceData.memberSelection.member);
        }
        expect(this.accountSelectValue).toBe(account);
        if (this.component.sourceData.accountSelection) {
            expect(this.memberSelectValue).toBe(this.component.sourceData.accountSelection.member);
            expect(this.accountSelectValue).toBe(this.component.sourceData.accountSelection.account);
        }
        expect(this.bubblesCountValue).toBe(records);
        expect(this.bubblesCountValue).toBe(this.component.topRecordsCount);
    }

    public matchTitle(numberOfPositive: string, percentagePositive: string, numberOfNegative: string,
                      percentageNegative: string, totalVaR: string) {
        expect(this.debugElement.query(By.css('.alert-info')).nativeElement.textContent)
            .toMatch(numberOfPositive.replace(/\./, '\\.') + '.+' + percentagePositive.replace(/\./, '\\.')
                + '.+' + numberOfNegative.replace(/\./, '\\.') + '.+' + percentageNegative.replace(/\./, '\\.')
                + '.+' + totalVaR.replace(/\./, '\\.') + '\\.');
    }
}