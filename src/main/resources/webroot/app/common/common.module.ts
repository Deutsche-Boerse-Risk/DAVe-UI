import {NgModule} from "@angular/core";

import {InitialLoadComponent} from "./initial.load.component";
import {NoDataComponent} from "./no.data.component";
import {UpdateFailedComponent} from "./update.failed.component";
import {GoogleChart} from "./google.chart.component";

@NgModule({
    declarations: [GoogleChart, InitialLoadComponent, NoDataComponent, UpdateFailedComponent],
    exports: [GoogleChart, InitialLoadComponent, NoDataComponent, UpdateFailedComponent]
})
export class CommonModule {
}