import { AxiosProgressEvent } from "axios";
import { AxiosRequest, createAxios } from "../utils/axios";
import { ApiInterface } from "../enum/interface";
import { FileManagerSpirit } from "../types/namespace";

export const createHttp = (baseUrl: string) => {
  return createAxios(baseUrl);
};

export class FileManagerApi {
  public $http: AxiosRequest;
  constructor(baseUrl: string) {
    this.$http = createAxios(baseUrl);
  }

  PROVIDER = {
    list: () => {
      return this.$http.$request<FileManagerSpirit.FileItem[]>({
        url: ApiInterface.PROVIDER_LIST,
        method: "get",
      });
    },
  };

  FILE = {
    list: (params: { path: string; current: number; size: number }) => {
      return this.$http.$request<{ content: FileManagerSpirit.FileList }>({
        method: "get",
        params,
        url: ApiInterface.FOLDER_CONTENT,
      });
    },
    upload: (
      data: { file: File; dir: string },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => void
    ) => {
      return this.$http.$request({
        method: "post",
        url: ApiInterface.FILE_UPLOAD,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: { file: data.file, path: data.dir },
        onUploadProgress,
      });
    },
    getUrl: (paths: string[]) => {
      return this.$http.$request<string[]>({
        method: "get",
        url: ApiInterface.FILE_URL,
        params: { path: paths.join(",") },
      });
    },
    delete: (path: string) => {
      return this.$http.$request({
        method: "delete",
        url: ApiInterface.FILE_DEL,
        params: { path },
      });
    },
    move: (dirs: { dir: string; newdir: string }[]) => {
      return this.$http.$request({
        method: "put",
        url: ApiInterface.FILE_MOVE,
        data: dirs,
      });
    },
    copy: (dirs: { dir: string; newdir: string }[]) => {
      return this.$http.$request({
        method: "put",
        url: ApiInterface.FILE_COPY,
        data: dirs,
      });
    },
    rename: (dir: string, newname: string) => {
      return this.$http.$request({
        method: "put",
        url: ApiInterface.FILE_RENAME,
        data: {
          dir,
          newname,
        },
      });
    },
  };

  DIR = {
    create: (path: string) => {
      return this.$http.$request({
        method: "post",
        url: `/create-folder`,
        data: {
          path,
        },
      });
    },
    delete: (pts: string[]) => {
      return this.$http.$request({
        method: "delete",
        url: ApiInterface.FOLDER_DEL,
        data: pts,
      });
    },

    rename: (dir: string, newname: string) => {
      return this.$http.$request({
        method: "put",
        url: `/dirs`,
        data: {
          dir,
          newdir: newname,
        },
      });
    },
    move: (dirs: { dir: string; newdir: string }[]) => {
      return this.$http.$request({
        method: "put",
        url: `/move-dirs`,
        data: dirs,
      });
    },
    copy: (dirs: { dir: string; newdir: string }[]) => {
      return this.$http.$request({
        method: "put",
        url: `/copy-dirs`,
        data: dirs,
      });
    },
  };
}

export const createFileManagerApi = (baseUrl: string) => {
  return new FileManagerApi(baseUrl);
};
