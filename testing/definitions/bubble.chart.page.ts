import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {LinkOnlyPage} from './link.only.page';
import {setNgModelSelectValue} from '../events';

import {INITIAL_LOAD_SELECTOR, NO_DATA_SELECTOR, UPDATE_FAILED_SELECTOR} from '../../app/common/message.component';

import {PositionReportBubbleChartComponent} from '../../app/position_reports/position.report.bubblechart.component';
import {PositionReportBubble} from '../../app/position_reports/position.report.types';

export class BubbleChartPage extends LinkOnlyPage<PositionReportBubbleChartComponent> {

    constructor(fixture: ComponentFixture<PositionReportBubbleChartComponent>) {
        super(fixture);
    }

    public get memberSelect(): DebugElement {
        return this.debugElement.query(By.css('[id="memberSelect"]'));
    }

    public selectMember(index: number): void {
        setNgModelSelectValue(this.memberSelect, index);
        this.detectChanges();
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
        this.detectChanges();
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
        this.detectChanges();
    };

    public get bubblesCountValue(): number {
        let selectedIndex = (this.bubblesCount.nativeElement as HTMLSelectElement).selectedIndex;
        if (selectedIndex === -1) {
            return undefined;
        }
        return this.component.topRecords[(this.bubblesCount.nativeElement as HTMLSelectElement).selectedIndex];
    }

    public get initialLoadVisible(): boolean {
        return this.debugElement.query(By.css(INITIAL_LOAD_SELECTOR)) !== null;
    }

    public get noDataVisible(): boolean {
        return this.debugElement.query(By.css(NO_DATA_SELECTOR)) !== null;
    }

    public get updateFailedVisible(): boolean {
        return this.debugElement.query(By.css(UPDATE_FAILED_SELECTOR)) !== null;
    }

    public get googleChartVisible(): boolean {
        return this.debugElement.query(By.css('google-chart')) !== null;
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