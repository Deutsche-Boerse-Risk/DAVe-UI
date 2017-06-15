import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {
    DataTableDefinition,
    LinkDefinition,
    PageWithLoading,
    RouterLinkStubDirective
} from '@dbg-riskit/dave-ui-testing';

import {DataTableComponent, HIGHLIGHTER_TIMEOUT} from '@dbg-riskit/dave-ui-datatable';

import {LiquiGroupMarginAggregationComponent} from '../../app/liqui_group_margin/liqui.group.margin.aggregation.component';

export class AggregationPage extends PageWithLoading<LiquiGroupMarginAggregationComponent> {

    constructor(fixture: ComponentFixture<LiquiGroupMarginAggregationComponent>) {
        super(fixture);
    }

    public get dataTable(): DataTableDefinition {
        return new DataTableDefinition(this.debugElement.query(By.directive(DataTableComponent)), this);
    }

    public get link(): LinkDefinition {
        const all = this.debugElement.queryAll(By.directive(RouterLinkStubDirective));
        return new LinkDefinition(this, all[all.length - 1]);
    }

    public advanceHighlighter(): void {
        this.advanceAndDetectChanges(HIGHLIGHTER_TIMEOUT);
    }
}