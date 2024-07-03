export const removeTreeNode = (
  treeList: Record<string, any>[],
  condition: (node: Record<string, any>) => boolean
) => {
  const index = treeList.findIndex(condition);
  if (index > -1) {
    treeList.splice(index, 1);
  } else {
    treeList.forEach((node) => {
      if (node.children) {
        removeTreeNode(node.children, condition);
      }
    });
  }
};

export const findTreeNode = (
  treeList: Record<string, any>[],
  condition: (node: Record<string, any>) => boolean
): Record<string, any> | undefined => {
  let result: Record<string, any> | undefined;
  for (let node of treeList) {
    if (condition(node)) {
      result = node;
      return result;
    }
    if (node.children) {
      result = findTreeNode(node.children, condition);
      return result;
    }
  }
  return result;
};
