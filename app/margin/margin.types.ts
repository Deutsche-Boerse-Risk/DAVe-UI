export interface MarginComponentsServerData {
    _id?: {
        clearer: string;
        member: string;
        account: string;
        clss: string;
        ccy: string
    };

    id: {
        $oid: string
    };

    clearer: string;
    member: string;
    account: string;
    clss: string;
    ccy: string;
    txnTm: string;
    bizDt: string;
    reqId: any;
    rptId: string;
    sesId: any;
    variationMargin: number;
    premiumMargin: number;
    liquiMargin: number;
    spreadMargin: number;
    additionalMargin: number;
    marketRisk: number;
    longOptionCredit: number;
    liquRisk: number;
    received: string;
}

export interface MarginComponentsBaseData {
    uid: string;
    clearer?: string;
    member?: string;
    account?: string;
    variationMargin: number;
    liquiMargin: number;
    premiumMargin: number;
    spreadMargin: number;
    additionalMargin: number;
}

export interface MarginComponentsAggregationData {
    aggregatedRows: MarginComponentsBaseData[];
    summary: MarginComponentsBaseData;
}

export interface NodeData {
    id: string;
    leaf?: boolean;
    text: string;
    value: number;

    clearer?: string;
    member?: string;
    account?: string;
    clss?: string;
    ccy?: string;
}

export class MarginComponentsTreeNode {

    public parent: MarginComponentsTreeNode;

    public children: MarginComponentsTreeNode[] = [];

    constructor(public data: NodeData) {
    }
}

export class MarginComponentsTree {

    private _root: MarginComponentsTreeNode;

    constructor(data: NodeData) {
        this._root = new MarginComponentsTreeNode(data);
    }

    public traverseDF(callback: (node: MarginComponentsTreeNode) => any) {
        let recurse = (currentNode: MarginComponentsTreeNode) => {
            for (let i = 0, length = currentNode.children.length; i < length; i++) {
                recurse(currentNode.children[i]);
            }
            callback(currentNode);
        };
        recurse(this._root);
    };

    public traverseBF(callback: (node: MarginComponentsTreeNode) => any) {
        let queue: MarginComponentsTreeNode[] = [];
        queue.push(this._root);
        let currentTree: MarginComponentsTreeNode = queue.pop();
        while (currentTree) {
            callback(currentTree);
            for (let i = 0, length = currentTree.children.length; i < length; i++) {
                queue.push(currentTree.children[i]);
            }
            currentTree = queue.pop();
        }
    };

    private contains(callback: (node: MarginComponentsTreeNode) => any) {
        this.traverseDF(callback);
    };

    public add(data: NodeData, parentId: string) {
        let child: MarginComponentsTreeNode = new MarginComponentsTreeNode(data),
            parent: MarginComponentsTreeNode,
            callback = (node: MarginComponentsTreeNode) => {
                if (node.data.id === parentId) {
                    parent = node;
                }
            };
        this.contains(callback);
        if (parent) {
            parent.children.push(child);
            child.parent = parent;
            while (!!parent) {
                parent.data.value += child.data.value;
                parent = parent.parent;
            }
        } else {
            throw new Error('Cannot add node to a non-existent parent.');
        }
    }
}