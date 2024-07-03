import { FileItem } from "@/lib/types";
import { Ref, unref } from "vue";
import { commandUpload } from "../command/file/upload";
import { getFileExtension } from "../utils/extension";
import { FileStatus } from "../enum/file-status";
import { fileToBase64, isImage } from "../utils/minetype";

export const useFilePutIn = ({
  fileList,
}: {
  fileList: Ref<FileItem[]>;
  currentPath: Ref<string>;
}) => {
  const handlePutIn = async (files: FileList | File[], currentPath: string) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileItem: FileItem = {
        name: file.name,
        size: file.size,
        type: file.type,
        status: FileStatus.Ready,
        __FILE: file,
        path: "",
        mockname: file.name,
        nameing: false,
        progress: 0,
        url: isImage(file.type) ? await fileToBase64(file) : "",
        dir: false,
      };
      fileList.value.push(fileItem);

      const currentFile = fileList.value[fileList.value.length - 1];

      const { fileName: currentFileName, fileExt: currentFileExt } =
        getFileExtension(currentFile.name)!;

      const names = unref(fileList).filter((f) => {
        if (f.dir) return false;
        const { fileName } = getFileExtension(f.name)!;
        return fileName.replace(/\([0-9]+\)$/, "") === currentFileName;
      });
      if (names.length > 1) {
        // 如果文件名重复，则自动重命名，与windows系统默认行为一致 添加（1）
        const nname = `${currentFileName}(${
          names.length - 1
        }).${currentFileExt}`;
        // 获取文件后缀名

        currentFile.name = nname;
        currentFile.mockname = nname;
        currentFile.__FILE = new File([currentFile.__FILE], nname);
      }
      // commandUpload(currentFile, currentPath);

      // 如果为图片文件，则需要先编辑
      if (!/image/.test(currentFile.type)) {
        commandUpload(currentFile, currentPath);
      }
    }
  };

  return {
    handlePutIn,
  };
};
