// 寻找上一级目录（父级）
export const findParentPath = (path: string) => {
  if (!path || path === "/") return null;

  return path.replace(/\/[^/]+$/, "");
};
