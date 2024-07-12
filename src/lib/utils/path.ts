export const findParentPath = (path: string) => {
  if (!path || path === "/") return null;

  return path.replace(/\/[^/]+$/, "");
};
