import { NK } from "../enum";
import { FileManagerSpirit } from "../types/namespace";

export const getShouldStartDragPaths = (
  currentPath: string,
  selectedFiles: FileManagerSpirit.FileItem[]
) => {
  if (!selectedFiles.length) {
    return currentPath;
  }
  const paths = selectedFiles.map((file) => file.path);
  if (paths.some((p) => p === currentPath)) {
    return paths.join(NK.ARRAY_JOIN_SEPARATOR);
  }
  return currentPath;
};
