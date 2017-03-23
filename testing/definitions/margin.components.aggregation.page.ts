import {By} from '@angular/platform-browser';

import {ComponentFixture} from '@angular/core/testing';

import {RouterLinkStubDirective} from '../stubs/router/router.link.stub';

import {PageWithLoading} from './page.base';
import {DataTableDefinition} from './data.table.definition';
import {LinkDefinition} from './link.definition';

import {DataTableComponent} from '../../app/datatable/data.table.component';
import {HIGHLIGHTER_TIMEOUT} from '../../app/datatable/highlighter.directive';

import {MarginComponentsAggregationComponent} from '../../app/margin/margin.components.aggregation.component';

export class AggregationPage extends PageWithLoading<MarginComponentsAggregationComponent> {

    constructor(fixture: ComponentFixture<MarginComponentsAggregationComponent>) {
        super(fixture);
    }

    public get dataTable(): DataTableDefinition {
        return new DataTableDefinition(this.debugElement.query(By.directive(DataTableComponent)), this);
    }

    public get link(): LinkDefinition {
        return new LinkDefinition(this, this.debugElement.query(By.directive(RouterLinkStubDirective)));
    }

    public advanceHighlighter(): void {
        this.advanceAndDetectChanges(HIGHLIGHTER_TIMEOUT);
    }
}