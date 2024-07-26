import { NK } from "../enum";
import { FileItemType } from "../types";
import { FileManagerSpirit } from "../types/namespace";

export const getFileExtension = (filename: string) => {
  if (!filename)
    return {
      fileName: "",
    };
  const index = filename.lastIndexOf(".");
  if (index === -1) {
    return { fileName: filename, fileExt: "" };
  }

  return {
    fileName: filename.slice(0, index),
    fileExt: filename.slice(index + 1),
  };
};

export const makeFileName = (
  filename: string,
  fileList: FileManagerSpirit.FileItem[],
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
