import {ComponentFixture, tick} from "@angular/core/testing";
import {GoogleChart} from "../app/common/google.chart.component";

export * from './definitions/data.table.definition';
export * from './definitions/list.page';

export * from './mock/position.reports.generator';

export * from './stubs/auth.service.stub';
export * from './stubs/http.service.stub';

export * from './stubs/router/activated.route.stub';
export * from './stubs/router/router.link.stub';
export * from './stubs/router/router.stub';

export * from './events';

export function advance(fixture: ComponentFixture<any>, millis: number = 0): void {
    tick(millis);
    if (millis > 0) {
        tick();
    }
    fixture.detectChanges();
}

/**
 * Special function that allows us to bind events so we can wait for chart rendering.
 */
export function waitForChart(chart: GoogleChart, done: () => any) {
    let drawFunction: () => void = (chart as any).drawGraph;
    (chart as any).drawGraph = () => {
        let wrapper = (chart as any).wrapper;
        waitForChartRedraw(chart, done);
        if (!wrapper) {
            google.charts.setOnLoadCallback(() => {
                let drawProto = google.visualization.ChartWrapper.prototype.draw;
                google.visualization.ChartWrapper.prototype.draw = function () {
                    wrapper = (chart as any).wrapper;
                    google.visualization.ChartWrapper.prototype.draw = drawProto;
                    let handle = google.visualization.events.addListener(wrapper, 'ready', function () {
                        google.visualization.events.removeListener(handle);
                        done();
                    });
                    drawProto.bind(wrapper)();
                };
            });
        }

        (chart as any).drawGraph = drawFunction;
        drawFunction.bind(chart)();
    };
}

export function waitForChartRedraw(chart: GoogleChart, done: () => any) {
    let wrapper = (chart as any).wrapper;
    if (wrapper) {
        let handle = google.visualization.events.addListener(wrapper, 'ready', function () {
            google.visualization.events.removeListener(handle);
            done();
        });
    }
}

