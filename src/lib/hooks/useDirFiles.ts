import { nextTick, Ref, ref, unref } from "vue";
import { FileItem } from "../types";
import { getDirContent as getDirFiles } from "@/lib/api/index";
import { FileStatus } from "../enum/file-status";

export const useDirFiles = ({ currentPath }: { currentPath: Ref<string> }) => {
  const fileList = ref<FileItem[]>([]);

  const getDirContent = async (clear: boolean = false) => {
    try {
      if (clear) {
        fileList.value = [];
        await nextTick();
      }
      const files = (await getDirFiles(
        unref(currentPath)
      )) as unknown as FileItem[];
      if (!files.length) {
        fileList.value = [];
      } else {
        fileList.value = files.map((i: any) => ({
          ...i,
          mockname: i.name,
          nameing: false,
          status: FileStatus.Completed,
        }));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return { fileList, loadDirContent: getDirContent };
};
