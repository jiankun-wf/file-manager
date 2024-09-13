import { AxiosProgressEvent } from "axios";
import { createAxios } from "../utils/axios";

export const getUrl = () => {
  return import.meta.env.DEV ? `/basic-api` : `http://192.168.188.111:8080`;
};

export const createHttp = (baseUrl: string) => {
  return createAxios(baseUrl);
};

const $http = createAxios(getUrl());

export const getBuketList = () => {
  return $http.request({
    url: "/file-providers",
    method: "get",
  });
};

export const getDirsList = () => {
  return $http.request({
    url: "/dirs",
    method: "get",
  });
};

export const getDirContent = (params: {
  path: string;
  current: number;
  size: number;
}) => {
  return $http.request({
    method: "get",
    params,
    url: "/file-list",
  });
};

export const renameDir = (dir: string, newdir: string) => {
  return $http.request({
    method: "put",
    url: `/dirs`,
    data: {
      dir,
      newdir,
    },
  });
};

export const createDir = (path: string) => {
  return $http.request({
    method: "post",
    url: `/create-folder`,
    data: {
      path,
    },
  });
};

export const moveDir = ({ dir, newdir }: { dir: string; newdir: string }) => {
  return $http.request({
    method: "put",
    url: `/dir/move`,
    data: {
      dir,
      newdir,
    },
  });
};

export const deleteDir = (pts: { dir: string }[]) => {
  return $http.request({
    method: "delete",
    url: `/dirs`,
    data: pts,
  });
};

export const createFile = (file: File) => {
  return $http.request({
    method: "post",
    url: `/create-file`,
    data: {
      file,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadFile = (
  data: { file: File; dir: string },
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  return $http.request({
    method: "post",
    url: `/dir-file?dir=${data.dir}`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: { file: data.file },
    onUploadProgress,
  });
};

export const deleteFile = (path: string) => {
  return $http.request({
    method: "post",
    url: `/delete-file?path=${path}`,
  });
};

export const renameFile = (filePath: string, newname: string) => {
  return $http.request({
    method: "put",
    url: `/dir-file`,
    data: {
      dir: filePath,
      newname: newname,
    },
  });
};

export const copyFile = (pts: { dir: string; newdir: string }[]) => {
  return $http.request({
    method: "post",
    url: `/dir-file/copy`,
    data: pts,
  });
};

export const moveFile = (pts: { dir: string; newdir: string }[]) => {
  return $http.request({
    method: "put",
    url: `/dir-file/move`,
    data: pts,
  });
};

export const downloadFile = (
  dir: string,
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  return $http.request({
    responseType: "blob",
    method: "get",
    url: `/download`,
    params: { dir },
    onDownloadProgress,
  });
};
