import {TestBed, inject} from "@angular/core/testing";

import {HttpServiceStub} from "../../testing/http.service.stub";
import {generatePositionReports} from "../../testing/mock/position.reports.generator";

import {HttpService} from "../http.service";

import {PositionReportsService} from "./position.reports.service";
import {PositionReportServerData, PositionReportData} from "./position.report.types";

describe('PositionReportsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PositionReportsService,
                {
                    provide: HttpService, useClass: HttpServiceStub
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<PositionReportServerData[]>) => {
        http.returnValue(generatePositionReports());
    }));

    it('latest data are correctly processed',
        inject([PositionReportsService], (positionReportsService: PositionReportsService) => {
            positionReportsService.getPositionReportLatest().subscribe((data) => {
                expect(data.length).toBe(Math.pow(3, 9));
                data.forEach((val: PositionReportData) => {
                    expect(val.strikePrice).toBeDefined();
                    expect(typeof val.strikePrice).toBe('number');
                    expect(val.netLS).toBe(val.crossMarginLongQty - val.crossMarginShortQty);
                    expect(val.netEA).toBe((val.optionExcerciseQty - val.optionAssignmentQty)
                        + (val.allocationTradeQty - val.deliveryNoticeQty));
                })
            });
        })
    );

    it('history data are correctly processed',
        inject([PositionReportsService], (positionReportsService: PositionReportsService) => {
            positionReportsService.getPositionReportHistory('*', '*', '*', '*', '*', '*', '*', '*', '*')
                .subscribe((data) => {
                    expect(data.length).toBe(Math.pow(3, 9));
                    data.forEach((val: PositionReportData) => {
                        expect(val.strikePrice).not.toBeDefined();
                        expect(val.netLS).toBe(val.crossMarginLongQty - val.crossMarginShortQty);
                        expect(val.netEA).toBe((val.optionExcerciseQty - val.optionAssignmentQty)
                            + (val.allocationTradeQty - val.deliveryNoticeQty));
                    })
                });
        })
    );
});