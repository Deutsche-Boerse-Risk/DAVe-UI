import {OrderingValueGetter} from '../app/datatable/data.table.column.directive';

import {DataTableDefinition, SortingHandle} from './definitions/data.table.definition';

export * from './definitions/bread.crumbs.page';
export * from './definitions/bubble.chart.page';
export * from './definitions/chart.page';
export * from './definitions/dashboard.page';
export * from './definitions/download.menu.page';
export * from './definitions/data.table.definition';
export * from './definitions/highlighter.directive.page';
export * from './definitions/initial.load.page';
export * from './definitions/link.definition';
export * from './definitions/link.only.page';
export * from './definitions/list.page';
export * from './definitions/login.page';
export * from './definitions/margin.components.aggregation.page';
export * from './definitions/menu.page';
export * from './definitions/no.data.page';
export * from './definitions/page.base';
export * from './definitions/shorfall.surplus.summary.page';
export * from './definitions/update.failed.page';

export * from './mock/margin.components.generator';
export * from './mock/margin.shortfall.surplus.generator';
export * from './mock/position.reports.generator';
export * from './mock/risk.limits.generator';
export * from './mock/total.margin.generator';

export * from './stubs/auth.service.stub';
export * from './stubs/http.service.stub';

export * from './stubs/router/activated.route.stub';
export * from './stubs/router/router.link.stub';
export * from './stubs/router/router.stub';

export {windowResize} from './events';

export function chceckSorting(page: {detectChanges: () => void, dataTable: DataTableDefinition},
                              criteria: OrderingValueGetter<any>[]) {
    page.dataTable.sorting.checkSorting(150);

    page.dataTable.sorting.handles.forEach((handle: SortingHandle, index: number) => {
        // Tigger sort based on a handle
        handle.click();
        page.detectChanges();

        // Check the sorting
        page.dataTable.sorting.checkSorting(150, {
            get: criteria[index]
        });

        // Tigger sort based on a handle
        handle.click();
        page.detectChanges();

        // Check the sorting
        page.dataTable.sorting.checkSorting(150, {
            get: criteria[index],
            descending: true
        });
    });
}