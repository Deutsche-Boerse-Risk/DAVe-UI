import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {RouterLinkStubDirective} from '../stubs/router/router.link.stub';

import {PageWithLoading} from './page.base';
import {DataTableDefinition} from './data.table.definition';
import {LinkDefinition} from './link.definition';

import {DataTableComponent} from '../../app/datatable/data.table.component';
import {HIGHLIGHTER_TIMEOUT} from '../../app/datatable/highlighter.directive';

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