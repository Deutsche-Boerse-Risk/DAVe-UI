import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {Observable} from 'rxjs/Observable';

import {
    MarginComponentsServerData,
    MarginComponentsTree, MarginComponentsTreeNode
} from './margin.types';

export const marginComponentsAggregationURL: string = '/mc/latest';
export const marginComponentsTreemapURL: string = '/mc/latest';

@Injectable()
export class MarginService {

    constructor(private http: HttpService<MarginComponentsServerData[]>) {
    }


    public getMarginComponentsTreeMapData(): Observable<MarginComponentsTree> {
        return this.http.get({resourceURL: marginComponentsTreemapURL}).map(
            (data: MarginComponentsServerData[]) => {
                if (!data || !data.length) {
                    return {
                        traverseDF: () => {
                        }
                    };
                }
                let members: { [key: string]: boolean } = {};
                let accounts: { [key: string]: boolean } = {};
                let classes: { [key: string]: boolean } = {};
                let tree = new MarginComponentsTree({
                    id   : 'all',
                    text : 'all',
                    value: 0
                });

                for (let index = 0; index < data.length; ++index) {
                    if (data[index].additionalMargin === 0) {
                        continue;
                    }

                    let clearer = data[index].clearer;
                    let member = clearer + '-' + data[index].member;
                    let account = member + '-' + data[index].account;
                    let clss = account + '-' + data[index].clss;
                    let ccy = clss + '-' + data[index].ccy;

                    if (!members[member]) {
                        members[member] = true;
                        tree.add({
                            id     : member,
                            text   : member.replace(/\w+-/, ''),
                            value  : 0,
                            clearer: clearer,
                            member : data[index].member
                        }, 'all');
                    }

                    if (!accounts[account]) {
                        accounts[account] = true;
                        tree.add({
                            id     : account,
                            text   : account.replace(/\w+-/, ''),
                            value  : 0,
                            clearer: clearer,
                            member : data[index].member,
                            account: data[index].account
                        }, member);
                    }

                    if (!classes[clss]) {
                        classes[clss] = true;
                        tree.add({
                            id     : clss,
                            text   : clss.replace(/\w+-/, ''),
                            value  : 0,
                            clearer: clearer,
                            member : data[index].member,
                            account: data[index].account,
                            clss   : data[index].clss
                        }, account);
                    }

                    tree.add({
                        id     : ccy,
                        text   : ccy.replace(/\w+-/, ''),
                        value  : data[index].additionalMargin,
                        leaf   : true,
                        clearer: clearer,
                        member : data[index].member,
                        account: data[index].account,
                        clss   : data[index].clss,
                        ccy    : data[index].ccy
                    }, clss);
                }
                tree.traverseDF((node: MarginComponentsTreeNode) => {
                    node.children.sort((a, b) => {
                        return b.data.value - a.data.value;
                    });
                });
                tree.traverseBF((node: MarginComponentsTreeNode) => {
                    let restNode = new MarginComponentsTreeNode({
                        id     : node.data.id + '-Rest',
                        text   : node.data.text + '-Rest',
                        value  : 0,
                        clearer: node.data.clearer
                    });
                    restNode.parent = node;
                    let aggregateCount = Math.max(node.children.length - 10, 0);
                    for (let i = 0; i < aggregateCount; i++) {
                        let smallNode = node.children.pop();
                        restNode.data.value += smallNode.data.value;
                        restNode.children = restNode.children.concat(smallNode.children);
                        for (let j = 0; j < smallNode.children.length; j++) {
                            smallNode.children[j].parent = restNode;
                        }
                    }
                    if (aggregateCount > 0) {
                        node.children.push(restNode);
                    }
                });
                return tree;
            });
    }
}