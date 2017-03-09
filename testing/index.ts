import {DebugElement} from "@angular/core";

import {OrderingValueGetter} from "../app/datatable/data.table.column.directive";

import {click} from "./events";
import {DataTableDefinition} from "./definitions/data.table.definition";

export * from './definitions/bubble.chart.page';
export * from './definitions/chart.page';
export * from './definitions/data.table.definition';
export * from './definitions/highlighter.directive.page';
export * from './definitions/initial.load.page';
export * from './definitions/list.page';
export * from './definitions/login.menu.page';
export * from './definitions/login.page';
export * from './definitions/no.data.page';
export * from './definitions/page.base';
export * from './definitions/update.failed.page';

export * from './mock/margin.components.generator';
export * from './mock/margin.shortfall.surplus.generator';
export * from './mock/position.reports.generator';

export * from './stubs/auth.service.stub';
export * from './stubs/http.service.stub';

export * from './stubs/router/activated.route.stub';
export * from './stubs/router/router.link.stub';
export * from './stubs/router/router.stub';

export * from './events';

export function chceckSorting(page: {detectChanges: () => void, dataTable: DataTableDefinition},
                              criteria: OrderingValueGetter<any>[]) {
    page.dataTable.sorting.checkSorting(150);

    page.dataTable.sorting.handles.forEach((handle: DebugElement, index: number) => {
        // Tigger sort based on a handle
        click(handle);
        page.detectChanges();

        // Check the sorting
        page.dataTable.sorting.checkSorting(150, {
            get: criteria[index]
        });

        // Tigger sort based on a handle
        click(handle);
        page.detectChanges();

        // Check the sorting
        page.dataTable.sorting.checkSorting(150, {
            get: criteria[index],
            descending: true
        });
    });
}