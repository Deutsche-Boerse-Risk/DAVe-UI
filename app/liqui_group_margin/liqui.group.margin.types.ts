export interface LiquiGroupMarginParams {
    clearer?: string;
    member?: string;
    account?: string;
    marginClass?: string;
    marginCurrency?: string;
}

export interface LiquiGroupMarginHistoryParams extends LiquiGroupMarginParams {
    clearer: string;
    member: string;
    account: string;
    marginClass: string;
    marginCurrency: string;
}

export interface LiquiGroupMarginBaseData {
    premiumMargin: number;
    currentLiquidatingMargin: number;
    additionalMargin: number;
    unadjustedMarginRequirement: number;
    variationPremiumPayment: number;
}

export interface LiquiGroupMarginServerData extends LiquiGroupMarginHistoryParams, LiquiGroupMarginBaseData {
    marginGroup: string;
    futuresSpreadMargin: number;
    snapshotID: number;
    businessDate: number;
    timestamp: number;
}

export interface LiquiGroupMarginData extends LiquiGroupMarginServerData {
    uid: string;
    received: Date;
}

export interface LiquiGroupMarginAggregationData {
    aggregatedRows: LiquiGroupMarginData[];
    summary: LiquiGroupMarginBaseData;
}

export interface LiquiGroupMarginNodeData extends LiquiGroupMarginParams {
    id: string;
    text: string;
    additionalMargin: number;
    formattedText?: string;
}

export class LiquiGroupMarginTreeNode {

    public parent: LiquiGroupMarginTreeNode;

    public children: LiquiGroupMarginTreeNode[] = [];

    constructor(public data: LiquiGroupMarginNodeData) {
    }

    public get leaf(): boolean {
        return !this.children || this.children.length === 0;
    }

    public get percentage(): number {
        if (this.parent == null) {
            return 1;
        }
        return this.data.additionalMargin / this.parent.data.additionalMargin;
    }

    public get totalPercentage(): number {
        let root: LiquiGroupMarginTreeNode = this;
        while (root.parent != null) {
            root = root.parent;
        }
        return this.data.additionalMargin / root.data.additionalMargin;
    }
}

export class LiquiGroupMarginTree {

    private _root: LiquiGroupMarginTreeNode;

    constructor(data: LiquiGroupMarginNodeData) {
        this._root = new LiquiGroupMarginTreeNode(data);
    }

    public get totalAdditionalMargin(): number {
        return this._root.data.additionalMargin;
    }

    public traverseDF(callback: (node: LiquiGroupMarginTreeNode) => any) {
        let recurse = (currentNode: LiquiGroupMarginTreeNode) => {
            for (let i = 0, length = currentNode.children.length; i < length; i++) {
                recurse(currentNode.children[i]);
            }
            callback(currentNode);
        };
        recurse(this._root);
    };

    public traverseBF(callback: (node: LiquiGroupMarginTreeNode) => any) {
        let queue: LiquiGroupMarginTreeNode[] = [];
        queue.push(this._root);
        let currentTree: LiquiGroupMarginTreeNode = queue.pop();
        while (currentTree) {
            callback(currentTree);
            for (let i = 0, length = currentTree.children.length; i < length; i++) {
                queue.push(currentTree.children[i]);
            }
            currentTree = queue.pop();
        }
    };

    private contains(callback: (node: LiquiGroupMarginTreeNode) => any) {
        this.traverseDF(callback);
    };

    public add(data: LiquiGroupMarginNodeData, parentId: string) {
        let child: LiquiGroupMarginTreeNode = new LiquiGroupMarginTreeNode(data),
            parent: LiquiGroupMarginTreeNode,
            callback = (node: LiquiGroupMarginTreeNode) => {
                if (node.data.id === parentId) {
                    parent = node;
                }
            };
        this.contains(callback);
        if (parent) {
            parent.children.push(child);
            child.parent = parent;
            while (!!parent) {
                parent.data.additionalMargin += child.data.additionalMargin;
                parent = parent.parent;
            }
        } else {
            throw new Error('Cannot add node to a non-existent parent.');
        }
    }
}