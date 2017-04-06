import {TestBed, inject} from '@angular/core/testing';

import {HttpServiceStub, generateMarginComponents} from '../../testing';
import Spy = jasmine.Spy;

import {HttpService, Request} from '../http.service';

import {MarginService, marginComponentsTreemapURL} from './margin.service';
import {
    MarginComponentsServerData,
    MarginComponentsTree,
    MarginComponentsTreeNode
} from './margin.types';

describe('MarginService', () => {
    let httpSyp: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MarginService,
                {
                    provide : HttpService,
                    useClass: HttpServiceStub
                }
            ]
        });
    });

    beforeEach(inject([HttpService], (http: HttpServiceStub<MarginComponentsServerData[]>) => {
        http.returnValue(generateMarginComponents());
        httpSyp = spyOn(http, 'get').and.callThrough();
    }));

    it('tree map data are correctly processed',
        inject([MarginService, HttpService],
            (marginComponentsService: MarginService,
                http: HttpServiceStub<MarginComponentsServerData[]>) => {
                http.popReturnValue();
                http.returnValue(generateMarginComponents(1, 15, 2, 15));
                marginComponentsService.getMarginComponentsTreeMapData()
                    .subscribe((data: MarginComponentsTree) => {
                        expect(httpSyp).toHaveBeenCalledTimes(1);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginComponentsTreemapURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();
                        let nodesCount = 0;
                        data.traverseDF((node: MarginComponentsTreeNode) => {
                            nodesCount++;

                            if (node.data.leaf) {
                                expect(node.children.length).toBe(0);
                            }
                            if (node.parent && node.children.length) {
                                let value = 0;
                                node.children.forEach((childNode: MarginComponentsTreeNode) => {
                                    value += childNode.data.value;
                                    expect(childNode.data.id).toMatch('^' + node.data.id.replace(/Rest/, ''));
                                });
                                expect(value).toBe(node.data.value);
                            }
                        });
                        expect(nodesCount).toBe(373);
                    });

                http.returnValue(null);
                marginComponentsService.getMarginComponentsTreeMapData()
                    .subscribe((data: MarginComponentsTree) => {
                        expect(httpSyp).toHaveBeenCalledTimes(2);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginComponentsTreemapURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();

                        expect((data as any)._root).not.toBeDefined();
                    });

                http.returnValue([]);
                marginComponentsService.getMarginComponentsTreeMapData()
                    .subscribe((data: MarginComponentsTree) => {
                        expect(httpSyp).toHaveBeenCalledTimes(3);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).resourceURL)
                            .toBe(marginComponentsTreemapURL);
                        expect((httpSyp.calls.mostRecent().args[0] as Request<any>).params).not.toBeDefined();

                        expect((data as any)._root).not.toBeDefined();
                    });
            })
    );
});