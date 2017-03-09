import {LocationStrategy} from '@angular/common';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Router, ActivatedRoute} from '@angular/router';

import {async, TestBed, fakeAsync, inject, ComponentFixture} from '@angular/core/testing';

import {
    RouterStub,
    LocationStrategyStub,
    ActivatedRouteStub,
    RouterLinkStubDirective,
    HttpAsyncServiceStub,
    PageWithLoading,
    DataTableDefinition,
    generateMarginComponents,
    generateMarginComponentsHistory,
    chceckSorting
} from '../../testing';

import {MarginComponentsService} from './margin.components.service';
import {MarginComponentsServerData} from './margin.types';
import {HttpService} from '../http.service';

import {CommonModule} from '../common/common.module';
import {DataTableModule} from '../datatable/data.table.module';
import {DataTableComponent} from '../datatable/data.table.component';
import {HIGHLIGHTER_CLASS} from '../datatable/highlighter.directive';

import {MarginComponentsAggregationComponent, valueGetters} from './margin.components.aggregation.component';

class AggregationPage extends PageWithLoading<MarginComponentsAggregationComponent> {

    constructor(fixture: ComponentFixture<MarginComponentsAggregationComponent>) {
        super(fixture);
    }

    public get dataTable(): DataTableDefinition {
        return new DataTableDefinition(this.debugElement.query(By.directive(DataTableComponent)), this.fixture);
    }
}

describe('Margin components aggregation component', () => {
    let page: AggregationPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                DataTableModule
            ],
            declarations: [
                MarginComponentsAggregationComponent,
                RouterLinkStubDirective
            ],
            providers: [
                MarginComponentsService,
                {
                    provide: HttpService, useClass: HttpAsyncServiceStub
                },
                {provide: Router, useClass: RouterStub},
                {provide: ActivatedRoute, useClass: ActivatedRouteStub},
                {provide: LocationStrategy, useClass: LocationStrategyStub}
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(inject([HttpService], (http: HttpAsyncServiceStub<MarginComponentsServerData[]>) => {
        // Generate test data
        http.returnValue(generateMarginComponents());
        // Create component
        page = new AggregationPage(TestBed.createComponent(MarginComponentsAggregationComponent));
    })));

    it('displays error correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<MarginComponentsServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadComponent).not.toBeNull('Initial load component visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');

            // Return error
            http.throwError({
                status: 500,
                message: 'Error message'
            });
            page.advance(1000);

            expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).not.toBeNull('Update failed component visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');
        })));

    it('displays no-data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<MarginComponentsServerData[]>) => {
            // Init component
            page.detectChanges();
            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);

            expect(page.initialLoadComponent).not.toBeNull('Initial load component visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');

            // Return no data
            http.popReturnValue(); // Remove from queue
            http.returnValue([]); // Push empty array
            page.advance(1000);

            expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).not.toBeNull('No data component visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).toBeNull('Data table not visible.');
        })));

    it('displays data table', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);

        expect(page.initialLoadComponent).not.toBeNull('Initial load component visible.');
        expect(page.noDataComponent).toBeNull('No data component not visible.');
        expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
        expect(page.dataTable.element).toBeNull('Data table not visible.');

        // Return data
        page.advance(1000);

        expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
        expect(page.noDataComponent).toBeNull('No data component not visible.');
        expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
        expect(page.dataTable.element).not.toBeNull('Data table visible.');

        // Fire highlighters
        page.advance(15000);
    }));

    it('refresh data correctly', fakeAsync(inject([HttpService],
        (http: HttpAsyncServiceStub<MarginComponentsServerData[]>) => {
            // Init component
            page.detectChanges();
            // Return data
            page.advance(1000);

            expect(page.initialLoadComponent).toBeNull('Initial load component not visible.');
            expect(page.noDataComponent).toBeNull('No data component not visible.');
            expect(page.updateFailedComponent).toBeNull('Update failed component not visible.');
            expect(page.dataTable.element).not.toBeNull('Data table visible.');

            expect(page.dataTable.body.tableRowElements.every((row: DebugElement) => {
                return row.nativeElement.classList.contains(HIGHLIGHTER_CLASS)
            })).toBeTruthy('All rows are highlighted');

            // Fire highlighters
            page.advance(15000);

            expect(page.dataTable.body.tableRowElements.every((row: DebugElement) => {
                return !row.nativeElement.classList.contains(HIGHLIGHTER_CLASS)
            })).toBeTruthy('No rows are highlighted');

            // Push new data
            let newData = generateMarginComponentsHistory();
            http.returnValue(newData);
            // Trigger reload
            page.advance(44000);
            // Return the data
            page.advance(1000);

            expect(page.dataTable.element).not.toBeNull('Data table visible.');

            expect(page.dataTable.body.tableRowElements.every((row: DebugElement) => {
                return row.nativeElement.classList.contains(HIGHLIGHTER_CLASS)
            })).toBeTruthy('All rows are highlighted');

            // Fire highlighters
            page.advance(15000);

            expect(page.dataTable.body.tableRowElements.every((row: DebugElement) => {
                return !row.nativeElement.classList.contains(HIGHLIGHTER_CLASS)
            })).toBeTruthy('No rows are highlighted');

            // Return the same data
            http.returnValue(newData);
            // Trigger reload
            page.advance(44000);
            // Return the data
            page.advance(1000);

            expect(page.dataTable.body.tableRowElements.every((row: DebugElement) => {
                return !row.nativeElement.classList.contains(HIGHLIGHTER_CLASS)
            })).toBeTruthy('No rows are highlighted');

            // Do not trigger periodic interval
            clearInterval((page.component as any).intervalHandle);
        })));

    xit('displays data correctly', fakeAsync(() => {
    }));

    xit('has correct row navigation', fakeAsync(() => {
    }));

    it('can be sorted correctly', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Return data
        page.advance(1000);
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);

        chceckSorting(page, [valueGetters.clearer, valueGetters.member, valueGetters.account,
            valueGetters.variationMargin, valueGetters.liquiMargin, valueGetters.premiumMargin,
            valueGetters.spreadMargin, valueGetters.additionalMargin]);

        // Fire highlighters
        page.advance(15000);
    }));

    xit('displays correct data in the footer', fakeAsync(() => {
    }));

    it('has pager disabled', fakeAsync(() => {
        // Init component
        page.detectChanges();
        // Return data
        page.advance(1000);
        // Do not trigger periodic interval
        clearInterval((page.component as any).intervalHandle);

        expect(page.dataTable.pager.debugElement).toBeNull('Pager not visible');

        // Fire highlighters
        page.advance(15000);
    }));
});