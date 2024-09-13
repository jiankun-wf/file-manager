import { reactive, ref, unref } from "vue";
import { FileStatus } from "../enum/file-status";
import { AxiosResponse, FileManagerSpirit } from "../types/namespace";
import { ApiInterface } from "../enum/interface";

export const useDirFiles = ({
  currentPath,
  $http,
}: {
  currentPath: FileManagerSpirit.currentPath;
  $http: FileManagerSpirit.AxiosRequest;
}) => {
  const fileList = ref<FileManagerSpirit.FileItem[]>([]);

  const paginationRef = reactive({
    current: 1,
    size: 500,
    total: 0,
    full: false,
  });

  const getDirContent = async (clear: boolean = false) => {
    try {
      if (clear) {
        paginationRef.current = 1;
        paginationRef.size = 500;
        paginationRef.total = 0;
        paginationRef.full = false;
      }
      if (!unref(currentPath)) return;
      if (paginationRef.full) return;
      const res = await $http.$request<
        AxiosResponse.Pagination & { content: FileManagerSpirit.FileItem[] }
      >({
        url: ApiInterface.DIR_CONTENT,
        method: "get",
        params: {
          path: unref(currentPath),
          size: paginationRef.size,
          current: paginationRef.current,
        },
      });

      const { content: files } = res;

      const fs = files.map((i: any) => ({
        ...i,
        mockname: i.name,
        nameing: false,
        status: FileStatus.Completed,
        dir: i.fileType === "FOLDER" ? true : false,
        path: i.uri,
      }));

      if (!files.length) {
        paginationRef.full = true;
      } else if (files.length < paginationRef.size) {
        const fl = files.length;
        paginationRef.total += fl;
        paginationRef.full = true;
        if (clear) {
          fileList.value = fs;
        } else {
          fileList.value = unref(fileList).concat(fs);
        }
      } else {
        const fl = files.length;
        paginationRef.total += fl;
        if (clear) {
          fileList.value = fs;
        } else {
          fileList.value = unref(fileList).concat(fs);
        }
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return { paginationRef, fileList, loadDirContent: getDirContent };
};
