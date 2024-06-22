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
) => {
  let result: Record<string, any> | undefined;
  treeList.forEach((node) => {
    if (condition(node)) {
      result = node;
      return;
    }
    if (node.children) {
      result = findTreeNode(node.children, condition);
      if (result) {
        return;
      }
    }
  });
  return result;
};
