import { NK } from "../enum";
import { FileItem, FileItemType } from "../types";

export const getFileExtension = (filename: string) => {
  const reg = /^(.+?)\.([a-zA-Z0-9]+)$/;
  const match = filename.match(reg);
  if (match) {
    const fileName = match[1];
    const fileExt = match[2];

    return { fileName, fileExt };
  }
};

export const makeFileName = (
  filename: string,
  fileList: FileItem[],
  type: FileItemType
) => {
  if (fileList.length === 0) {
    return filename;
  }

  const { fileName: currentFileName = filename, fileExt: currentFileExt } =
    getFileExtension(filename) || {};

  const names = fileList.filter((f) => {
    if (type === NK.FILE_FLAG_TYPE) {
      if (f.dir) return false;
      const { fileName } = getFileExtension(f.name)!;
      return fileName.replace(/\([0-9]+\)$/, "") === currentFileName;
    } else {
      if (!f.dir) return false;
      return f.name.replace(/\([0-9]+\)$/, "") === currentFileName;
    }
  });

  const overrideIndex = names.length > 0 ? `(${names.length})` : "";
  if (type === NK.FILE_FLAG_TYPE) {
    return `${currentFileName}${overrideIndex}.${currentFileExt}`;
  } else {
    return `${currentFileName}${overrideIndex}`;
  }
};
