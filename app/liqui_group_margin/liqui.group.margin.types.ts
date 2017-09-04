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

export interface LiquiGroupMarginServerData extends LiquiGroupMarginHistoryParams {
    premiumMargin: number;
    currentLiquidatingMargin: number;
    additionalMargin: number;
    unadjustedMarginRequirement: number;
    variationPremiumPayment: number;
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

export interface LiquiGroupMarginNodeData extends LiquiGroupMarginParams {
    id: string;
    text: string;
    additionalMargin: number;
    formattedText?: string;
}

export interface LiquiGroupMarginTreeNode {
    parent?: LiquiGroupMarginTreeNode;
    children: LiquiGroupMarginTreeNode[];
    data: LiquiGroupMarginNodeData;
}

export function isLeaf(node: LiquiGroupMarginTreeNode): boolean {
    return !node.children || node.children.length === 0;
}

export function nodePercentage(node: LiquiGroupMarginTreeNode): number {
    if (node.parent == null) {
        return 1;
    }
    return node.data.additionalMargin / node.parent.data.additionalMargin;
}

export function totalPercentage(node: LiquiGroupMarginTreeNode): number {
    let root: LiquiGroupMarginTreeNode = node;
    while (root.parent != null) {
        root = root.parent;
    }
    return node.data.additionalMargin / root.data.additionalMargin;
}

export class LiquiGroupMarginTree {

    public root: LiquiGroupMarginTreeNode;

    constructor(data: LiquiGroupMarginNodeData) {
        this.root = {
            data,
            children: []
        };
    }
}

export function totalAdditionalMargin(tree: LiquiGroupMarginTree): number {
    return tree.root.data.additionalMargin;
}

export function traverseDF(tree: LiquiGroupMarginTree, callback: (node: LiquiGroupMarginTreeNode) => any) {
    let recurse = (currentNode: LiquiGroupMarginTreeNode) => {
        for (let i = 0, length = currentNode.children.length; i < length; i++) {
            recurse(currentNode.children[i]);
        }
        callback(currentNode);
    };
    recurse(tree.root);
}

export function traverseBF(tree: LiquiGroupMarginTree, callback: (node: LiquiGroupMarginTreeNode) => any) {
    let queue: LiquiGroupMarginTreeNode[] = [];
    queue.push(tree.root);
    let currentTree: LiquiGroupMarginTreeNode = queue.pop();
    while (currentTree) {
        callback(currentTree);
        for (let i = 0, length = currentTree.children.length; i < length; i++) {
            queue.push(currentTree.children[i]);
        }
        currentTree = queue.pop();
    }
}

export function addNodeToTree(tree: LiquiGroupMarginTree, data: LiquiGroupMarginNodeData, parentId: string) {
    let child: LiquiGroupMarginTreeNode = {
            data,
            children: []
        },
        parent: LiquiGroupMarginTreeNode,
        callback = (node: LiquiGroupMarginTreeNode) => {
            if (node.data.id === parentId) {
                parent = node;
            }
        };
    traverseDF(tree, callback);
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